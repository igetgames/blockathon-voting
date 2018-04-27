const Voting = artifacts.require('./Voting.sol');

let voting;

before(async () => {
  voting = await Voting.deployed();
});

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
      let name =  "lame winners";
      let teamId = await voting.addTeam.call(lead2, name);
      await voting.addTeam(lead2, name);
      let result = await voting.getTeam.call(teamId.c[0]);
      let resIsActive = result[0];
      let resName = result[1];
      let resLead = result[2];
      assert.equal(resIsActive, true, 'newly created team was not active');
      assert.equal(resName, name, 'team name did not match');
      assert.equal(resLead, lead2, 'team leader did not match');
    });

    it(`will not allow '_lead' to have a team if they already are on a team`, async () => {
      await assertExceptionOccurs(async () => { await voting.addTeam(lead2, "new team"); });
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

  // describe('closeVoteCategory', () => {
  //   it(`handles index out of bounds`, async () => {

  //   });

  //   it(`should set VoteCategory to inactive`, async () => {

  //   });

  //   it(`should only work if sender is a chairperson`, async () => {

  //   });
  // });

  // describe('addTeamMember', () => {
  //   it(`should work if sender is a leader`, async () => {

  //   });

  //   it(`should work if sender is a chairperson`, async () => {

  //     // should register if not already registered . . . 
  //   });

  //   it(`should only work if member is a registered participant`, async () => {

  //   });

  //   it(`should handle invalid teamId`, async () => {

  //   });

  //   it(`should add the member to the team`, async () => {

  //   });
  // });

  // describe('changeTeamName', () => {
  //   it(`should only work if sender is a leader`, async () => {

  //   });

  //   it(`should handle invalid teamId`, async () => {

  //   });

  //   it(`should update the team name`, async () => {

  //   });
  // });

  // describe('vote', () => {
  //   it(`should only work if sender is a participant`, async () => {

  //   });

  //   it(`should handle invalid teamId`, async () => {

  //   });

  //   it(`should not be successful if invalid voteCatId`, async () => {

  //   });

  //   it(`should warn participant if they already voted`, async () => {
 
  //   });
    
  //   it(`should allow participant to change vote`, async () => {
  //     // also ensure that numVotes is NOT incremented

  //   });

  //   it(`should ensure that the vote value is in the given range`, async () => {

  //   });

  //   it(`should mark the participant as a voter`, async () => {

  //   });

  //   it(`should increment the number of votes if the participant has not voted for that cat/team combo yet`, async () => { th

  //   });
  // });

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
