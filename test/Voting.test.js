const DEBUG = false;

const Voting = artifacts.require('./Voting.sol');

let voting;

before(async () => {
  voting = await Voting.deployed();
});

function dlog(msg) {
  if (DEBUG) {
    console.log(msg);
  }
}

contract('Voting', accounts => {

  let ogChairperson = accounts[0];
  let lead1 = accounts[1];
  let lead2 = accounts[2];
  let lead3 = accounts[3];
  let mem1a = accounts[4];
  let mem1b = accounts[5];
  let mem2a = accounts[6];
  let mem2b = accounts[7];
  let mem3a = accounts[8];
  let mem3b = accounts[9];

  let chairperson2 = lead1;

  // TODO: nonMemberVoter?

  async function assertExceptionOccurs(action) {
      let exceptionOccurred = false;
      try {
        await action();
      }
      catch (error) {
        exceptionOccurred = true;
      }
      assert(exceptionOccurred);
  }

  async function addTeam(voteContract, name, lead, members) {
    let teamId = await voteContract.addTeam.call(lead, name);
    await voteContract.addTeam(lead, name);
    teamId = teamId.c[0];
    if (members && members.length) {
      for (var i = 0; i < members.length; i++) {
        dlog(`about to register member ${members[i]}... into team ${teamId}`)
        await voteContract.addMemberToTeam(members[i], teamId);
      }
    }
  }

  async function leaderAddTeam(voteContract, name, lead, members) {
    let teamId = await voting.registeredMembers.call(lead);
    if (teamId.c[0] === 0) {
      dlog("creating team")
      await voteContract.addTeam(lead, name);
    }
    else {
      dlog(`leader team already exists (${teamId.c[0]})`)
    }

    if (members && members.length) {
      for (var i = 0; i < members.length; i++) {
        let memTeamId = await voting.registeredMembers.call(members[i]);
        if (memTeamId.c[0] === 0) {
          dlog(`about to register member ${members[i]}... into team ${teamId}`)
          await voteContract.addTeamMember(members[i], {from: lead});
        }
        else {
          dlog(`member ${members[i]} already registered to team`)
        }
      }
    }
  }

  describe('addChairperson', () => {
    it(`should set the passed-in address as a chairperson`, async () => {
      await voting.addChairperson(chairperson2);
      let result = await voting.chairpersons.call(chairperson2);
      assert.equal(result, true, '"chairperson2" did not end up a chairperson');
    });

    it(`should only work if sender is a chairperson`, async () => {
      await assertExceptionOccurs(async () => { await voting.addChairperson(mem3b, {from: mem3b}); });
    });
  });

  describe('registerParticipant', () => {
    it(`should set the passed-in address as a participant`, async () => {
      await voting.registerParticipant(mem1a);
      let result = await voting.registeredParticipants.call(mem1a);
      assert.equal(result, true, '"mem1a" was not a registered participant');
    });

    it(`should only work if sender is a chairperson`, async () => {
      await assertExceptionOccurs(async () => { await voting.registerParticipant(mem3b, {from: mem3b}); });
    });
  });

  describe('kickParticipant', () => {
    it(`should set the passed-in address as a participant`, async () => {
      await voting.registerParticipant(mem1a);
      await voting.kickParticipant(mem1a);
      let result = await voting.registeredParticipants.call(mem1a);
      assert.equal(result, false, '"mem1a" was not a registered participant');
    });

    it(`should only work if sender is a chairperson`, async () => {
      await assertExceptionOccurs(async () => { await voting.kickParticipant(mem3b, {from: mem3b}); });
    });
  });

  describe('addTeam', () => {
    it(`should register '_lead' as a participant if not already a participant`, async () => {
      let name =  "alfa team"; //(spelling intentional)
      let teamId = await voting.addTeam.call(lead1, name);
      await voting.addTeam(lead1, name);
      let result = await voting.getTeam.call(teamId.c[0]);
      let resIsActive = result[0];
      let resName = result[1];
      let resLead = result[2];
      let numMems = result[3];
      
      assert.equal(resIsActive, true, 'newly created team was not active');
      assert.equal(resName, name, 'team name did not match');
      assert.equal(resLead, lead1, 'team leader did not match');
      assert.equal(numMems, 1, 'number of members was not 1');
    });

    it(`will not allow '_lead' to have a team if they already are on a team`, async () => {
      await assertExceptionOccurs(async () => { await voting.addTeam(lead1, "new team"); });
    });

    it(`should only work if sender is a chairperson`, async () => {
      await assertExceptionOccurs(async () => { await voting.addTeam(mem3b, "cool losers", {from: mem3b}); });
    });
  });

  describe('addVoteCategory', () => {
    it(`successfully adds a category`, async () => {
      let name =  "originality";
      let min = 0;
      let max = 10;
      // Apparently, can't call anything but the base function if there are overloads . . .
      await voting.addVoteCategory(name, min, max);

      let result = await voting.voteCategories.call(0);
      let resIsActive = result[0];
      let resName = result[1];
      let resMin = result[2].c[0];
      let resMax = result[3].c[0];
      let numVotes = result[4].c[0];

      assert.equal(resIsActive, true, 'newly created voteCat was not active');
      assert.equal(resName, name, 'voteCat name did not match');
      assert.equal(resMin, min, 'voteCat min did not match');
      assert.equal(resMax, max, 'voteCat max did not match');
      assert.equal(numVotes, 0, 'new voteCat numVotes was not 0');
    });

    it(`increments numVoteCategories`, async () => {
      let result = await voting.numVoteCategories.call();
      assert.equal(result.c[0], 1, 'numVoteCategories was not 1');
    });

    it(`should only work if sender is a chairperson`, async () => {
      await assertExceptionOccurs(async () => { await voting.addVoteCategory("coolness", {from: mem3b}); });
    });
  });

  describe('closeVoteCategory', () => {
    it(`handles index out of bounds`, async () => {
      // TODO (not high priority)
    });

    it(`should set VoteCategory to inactive`, async () => {
      let name =  "presentation";
      await voting.addVoteCategory(name, 0, 10); // this is the 2nd category... index starts at 0 ("originality")... id of this is 1
      let response = await voting.closeVoteCategory.call(1);
      assert.equal(response[0], true, '"isSuccess_" was false');
      await voting.closeVoteCategory(1);
      let result = await voting.voteCategories.call(1);
      let resIsActive = result[0];

      assert.equal(resIsActive, false, 'closed voteCat was still active');
    });

    it(`should only work if sender is a chairperson`, async () => {
      await assertExceptionOccurs(async () => { await voting.closeVoteCategory(0, {from: mem3b}); });
    });
  });

  describe('addMemberToTeam', () => {
    it(`should work if sender is a chairperson`, async () => {
      // (this `addTeam` abstraction may conceal the call, but it's just so darn handy)
      addTeam(voting, "beta team", lead2, [mem2a]);

      await assertExceptionOccurs(async () => { await voting.addMemberToTeam(mem3b, 1, {from: mem3b}); });
    });

    it(`should register if not already registed`, async () => {
      await voting.getTeam.call(1); // TODO: Figure out why it only works with this line
      let result = await voting.registeredParticipants.call(mem2a);
      assert.equal(result, true, '"mem2a" was not a registered participant');
    });

    it(`should not allow invalid teamId`, async () => {
      await assertExceptionOccurs(async () => { await voting.addMemberToTeam(mem3b, 0); });
      await assertExceptionOccurs(async () => { await voting.addMemberToTeam(mem3b, 9001); });
    });

    it(`should add the member to the team`, async () => {
        let result = await voting.registeredMembers.call(mem2a);
        assert.equal(result.c[0], 2, `mem2a wasn't on correct team`);
    });
  });

  describe('addTeamMember', () => {
    it(`should work if sender is a leader`, async () => {
      await voting.registerParticipant(mem3a);
      await leaderAddTeam(voting, "gamma team", lead3, [mem3a]);
      await assertExceptionOccurs(async () => { await voting.addTeamMember(mem3b, {from: mem3b}); });
    });

    it(`should only work if member is a registered participant`, async () => {
      await assertExceptionOccurs(async () => { await leaderAddTeam(voting, "gamma team", lead3, [mem3b]) });
    });

    it(`should add the member to the team`, async () => {
      let result = await voting.registeredMembers.call(mem3a);
      assert.equal(result.c[0], 3, `mem3a wasn't on correct team`);
    });
  });

  describe('changeTeamName', () => {
    it(`should update the team name`, async () => {
      let newName = 'alpha team';
      await voting.changeTeamName(newName, {from: lead1});
      let result = await voting.getTeam.call(1);
      let resName = result[1];
      assert.equal(resName, newName, `name was not updated`);
    });

    it(`should only work if sender is a leader`, async () => {
      await voting.registerParticipant(mem1a);      
      await leaderAddTeam(voting, "(this name doesn't matter since leader already has a team)", lead1, [mem1a]);
      await assertExceptionOccurs(async () => { await voting.changeTeamName("losers", {from: mem1a}) });
    });
  });

  async function setUpTeam(voting, name, lead, members) {
    if (members.length) {
      for (var i = 0; i < members.length; i++) {
        await voting.registerParticipant(members[i]);
      }
    }
    await leaderAddTeam(voting, name, lead, members);
  }

  describe('vote', () => {
    it(`should only work if sender is a participant`, async () => {
      await assertExceptionOccurs(async () => { await voting.vote(0, 2, false, {from: mem2b}) });
    });

    it(`should not allow invalid teamId`, async () => {
      await assertExceptionOccurs(async () => { await voting.vote(0, 42, false, {from: mem2a}) });
    });

    it(`should not be successful if invalid voteCatId`, async () => {
      await assertExceptionOccurs(async () => { await voting.vote(31337, 2, false, {from: mem2a}) });
    });

    it(`should mark the participant as a voter`, async () => {
      await voting.vote(0, 2, 5, false, {from: mem2a});
      
      let result = await voting.voted.call(0, mem2a, 2);

      assert.equal(result, true, `participant wasn't marked as voting in the cat team combo`);
      
    });

    it(`should increment the number of votes if the participant has not voted for that cat/team combo yet`, async () => {
      let result = await voting.voteCategories.call(0);
      let numVotes = result[4].c[0];
      
      await voting.vote(0, 2, 6, false, {from: mem3a});
      
      let result2 = await voting.voteCategories.call(0);
      let numVotes2 = result2[4].c[0];

      assert.equal(numVotes + 1, numVotes2, `num votes not incremented`);
    });

    // it(`should warn participant if they already voted`, async () => {

    // });

    // it(`should allow participant to change vote`, async () => {
    //   // also ensure that numVotes is NOT incremented

    // });

    // it(`should ensure that the vote value is in the given range`, async () => {

    // });

  });

  // describe('getWinningTeamsForCategory', () => {
  //   it(`can correctly compute a sole winner`, async () => {

  //   });

  //   it(`can correctly compute a tie between multiple winners`, async () => {

  //   });

  //   it(`can correctly compute a winner ignoring a selfish-voting team`, async () => {

  //   });

  //   it(`can correctly compute a winner including non-member participants`, async () => {

  //   });
  // });

  // describe('getBestInShow', () => {
  //   it(`computes overall winner(s)`, async () => {

  //   });
  // });


  // describe('giveRightToVote', () => {
  //   accounts.forEach(async (element, i) => {
  //     it(`should give accounts[${i}] the right to vote`, async () => {
  //       await voting.giveRightToVote(accounts[i]);
  //       assert.lengthOf(
  //         await voting.voters.call(accounts[i]),
  //         2,
  //         `failed adding voter ${i}`
  //       );
  //     });
  //   });
  // });

  // describe('addProposal', () => {
  //   it(`should add a project proposal`, async () => {
  //     await voting.addProposal('test project name');
  //     let proposal = await voting.proposals.call(0);
  //     proposal = proposal[0];
  //     assert.equal(
  //       proposal,
  //       'test project name',
  //       'failed adding proposal "test project name"'
  //     );
  //   });
  // });

  // describe('vote', () => {
  //   accounts.forEach(async (element, i) => {
  //     it(`should vote for the first project from accounts[${i}]`, async () => {
  //       await voting.vote(0, { from: accounts[i] });
  //       let proposalVoteCount = await voting.proposals.call(0);
  //       proposalVoteCount = proposalVoteCount[1];
  //       assert.equal(proposalVoteCount, i + 1, `failed voting`);
  //     });
  //   });
  // });

  // describe('winnerName', () => {
  //   it('should find the winning project: "test project name"', async () => {
  //     let proposalVoteCount = await voting.proposals.call(0);
  //     proposalVoteCount = proposalVoteCount[1];
  //     assert.equal(
  //       await voting.winnerName(),
  //       'test project name',
  //       `wrong winner found`
  //     );
  //   });
  // });
});
