const Voting = artifacts.require('./Voting.sol');

let voting;

before(async () => {
  voting = await Voting.deployed();
});

contract('Voting', accounts => {

  describe('addChairperson', () => {
    it(`should set the passed-in address as a chairperson`, async () => {
  //     await voting.addProposal('test project name');
  //     let proposal = await voting.proposals.call(0);
  //     proposal = proposal[0];
  //     assert.equal(
  //       proposal,
  //       'test project name',
  //       'failed adding proposal "test project name"'
  //     );
    });

    it(`should only work if sender is a chairperson`, async () => {

    });
  });

  describe('registerParticipant', () => {
    it(`should set the passed-in address as a participant`, async () => {

    });

    it(`should only work if sender is a chairperson`, async () => {

    });
  });

  describe('addTeam', () => {
    it(`should register '_lead' as a participant if not already a participant`, async () => {

    });

    it(`will not allow '_lead' to have a team if they already are on a team`, async () => {

    });

    it(`should only work if sender is a chairperson`, async () => {

    });
  });

  describe('addVoteCategory', () => {
    it(`successfully adds a category`, async () => {

    });

    it(`increments numVoteCategories`, async () => {

    });

    it(`should only work if sender is a chairperson`, async () => {

    });
  });

  describe('closeVoteCategory', () => {
    it(`handles index out of bounds`, async () => {

    });

    it(`should set VoteCategory to inactive`, async () => {

    });

    it(`should only work if sender is a chairperson`, async () => {

    });
  });

  describe('addTeamMember', () => {
    it(`should work if sender is a leader`, async () => {

    });

    it(`should work if sender is a chairperson`, async () => {

      // should register if not already registered . . . 
    });

    it(`should only work if member is a registered participant`, async () => {

    });

    it(`should handle invalid teamId`, async () => {

    });

    it(`should add the member to the team`, async () => {

    });
  });

  describe('changeTeamName', () => {
    it(`should only work if sender is a leader`, async () => {

    });

    it(`should handle invalid teamId`, async () => {

    });

    it(`should update the team name`, async () => {

    });
  });

  describe('vote', () => {
    it(`should only work if sender is a participant`, async () => {

    });

    it(`should handle invalid teamId`, async () => {

    });

    it(`should not be successful if invalid voteCatId`, async () => {

    });

    it(`should warn participant if they already voted`, async () => {
 
    });
    
    it(`should allow participant to change vote`, async () => {
      // also ensure that numVotes is NOT incremented

    });

    it(`should ensure that the vote value is in the given range`, async () => {

    });

    it(`should mark the participant as a voter`, async () => {

    });

    it(`should increment the number of votes if the participant has not voted for that cat/team combo yet`, async () => { th

    });
  });

  describe('getWinningTeamsForCategory', () => {
    it(`can correctly compute a sole winner`, async () => {

    });

    it(`can correctly compute a tie between multiple winners`, async () => {

    });

    it(`can correctly compute a winner ignoring a selfish-voting team`, async () => {

    });

    it(`can correctly compute a winner including non-member participants`, async () => {

    });
  });

  describe('getBestInShow', () => {
    it(`computes overall winner(s)`, async () => {

    });
  });


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
