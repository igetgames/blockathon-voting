pragma solidity ^0.4.20;

contract Voting {

    // structs

    struct Team {
        bool      isActive; // TODO: Use this where needed, and add method to revoke a team
        string    name;     // short name (up to 32 bytes)
        address   lead;
        
        uint      numMembers;
    }

    struct Vote {
        address voter;
        uint    teamId; // NOTE: `0` is used as a type of "null" for this field
        uint    value;
    }

    struct VoteCategory {
        bool   isActive;
        string name;     // short name (up to 32 bytes)
        uint   minValue; // This is the lower bound for the voting scale
        uint   maxValue; // This is the upper bound for the voting scale

        // NOTE: In this contract, the bounds of voting scale range are inclusive!

        mapping(uint => Vote) votes;
        uint numVotes;

        // Mapping for somewhat-efficient lookup
        mapping(address /* voter */ => mapping(uint /* teamId */ => bool /* hasVoted */ )) voters;
    }

    // properties

    mapping(address => bool) public registeredParticipants;
    mapping(address => uint) public registeredMembers;

    Team[] private teams;

    // (accessor for private prop)
    function getTeam(uint _teamId) public view 
        returns (bool isActive, string name, address lead, uint numMembers) // defying self-established convention to mock struct returns
    {
        assert(_teamId <= teams.length && _teamId != 0);

        isActive   = teams[_teamId - 1].isActive;
        name       = teams[_teamId - 1].name;
        lead       = teams[_teamId - 1].lead;
        numMembers = teams[_teamId - 1].numMembers;
    }

    mapping(uint => VoteCategory) public voteCategories;
    uint public numVoteCategories;

    address public ogChairperson;
    mapping(address => bool) public chairpersons;

    // modifiers

    modifier onlyChairperson() {
        require(chairpersons[msg.sender]);
        _;
    }

    modifier onlyTeamLead(uint _teamId) {
        if (isTeamLead(_teamId, msg.sender)) _;
    }

    modifier validTeamId(uint _teamId) {
        assertIsValidTeamId(_teamId);
        _;
    }

    modifier onlyRegistered() {
        if (registeredParticipants[msg.sender]) _;
    }

    // modifier functions (for code reuse later on in this contract)

    function isTeamLead(uint _teamId, address _user) internal returns (bool) {
        return (_teamId <= teams.length && teams[_teamId - 1].lead == _user);
    }

    function assertIsValidTeamId(uint _teamId) internal {
        assert(_teamId > 0);
    }

    // ctor

    constructor() public {
        ogChairperson = msg.sender;
        chairpersons[ogChairperson] = true;
    }

    // vote-setup-related functions (by chairpersons)

    function addChairperson(address _chairperson) public onlyChairperson {
        chairpersons[_chairperson] = true;
    }

    function removeChairperson(address _chairperson) public onlyChairperson {
        require(msg.sender == ogChairperson 
            && _chairperson != ogChairperson
            && _chairperson != address(0));

        chairpersons[_chairperson] = false;
    }

    function registerParticipant(address _participant) public onlyChairperson {
        registeredParticipants[_participant] = true;
    }

    function kickParticipant(address _participant) public onlyChairperson {
        registeredParticipants[_participant] = false;
        // We'll want to make sure we check if member is a participant for 
        // every action that should be restricted to registered participants
    }

    function addTeam(address _lead, string _tempName) public onlyChairperson returns (uint teamId_) {
        if (!registeredParticipants[_lead]) {
            registerParticipant(_lead);
        }

        assert(registeredMembers[_lead] == 0);

        // (recall that `.push(T)` returns the new _length_)
        teamId_ = teams.push(Team({
            isActive:    true,
            name:       _tempName,
            lead:       _lead,
            numMembers:  1
        }));

        registeredMembers[_lead] = teamId_;
    }

    function addVoteCategory(string _name) public onlyChairperson {
        // "Feasibility", "Coolness", "Implementation", "Importance", "Presentation" etc . . .
        addVoteCategory(_name, 0, 10);
    }

    // (Overload with min max values for votes)
    function addVoteCategory(string _name, uint _minValue, uint _maxValue) public onlyChairperson {
        voteCategories[numVoteCategories] = VoteCategory({
            isActive:  true,
            name:     _name,
            minValue: _minValue,
            maxValue: _maxValue,
            numVotes: 0
        });
        numVoteCategories++;
    }

    function closeVoteCategory(uint _index) public onlyChairperson
        returns (bool isSuccess_, bool catNotFound_, bool alreadyClosed_) 
    {
        isSuccess_     = false;
        catNotFound_   = false;
        alreadyClosed_ = false;

        if (numVoteCategories <= _index) {
            catNotFound_ = true;
        }
        else if (!voteCategories[_index].isActive) {
            alreadyClosed_ = true;
        }
        else {
            voteCategories[_index].isActive = false;

            isSuccess_ = true;
        }
    }

    // vote-setup-related functions

    function addMemberToTeam(address _member, uint _teamId) public onlyChairperson validTeamId(_teamId) {
        registeredParticipants[_member] = true;

        require(registeredMembers[_member] == 0);

        registeredMembers[_member] = _teamId;
        teams[_teamId - 1].numMembers++;
    }

    function addTeamMember(address _member) public /* onlyTeamLead validTeamId */ {
        require(registeredParticipants[msg.sender]);
        require(registeredParticipants[_member]);
        
        uint teamId = registeredMembers[msg.sender];

        // validTeamId
        assertIsValidTeamId(teamId);

        // onlyTeamLead
        require(isTeamLead(teamId, msg.sender));

        require(registeredMembers[_member] == 0);

        registeredMembers[_member] = teamId;
        teams[teamId - 1].numMembers++;        
    }

    function changeTeamName(string _newName) public {
        uint teamId = registeredMembers[msg.sender];

        // validTeamId
        assertIsValidTeamId(teamId);

        // onlyTeamLead
        require(isTeamLead(teamId, msg.sender));

        teams[teamId - 1].name = _newName;
    }

    // // voting (by team members)
    // function vote(uint _voteCategoryId, uint _teamId, uint _value) public onlyRegistered validTeamId(_teamId)
    //     returns (bool isSuccess_, bool indexOutOfRange_, bool alreadyVotedWarning_, bool valueOutOfRange_)
    // {
    //     return vote(_voteCategoryId, _teamId, _value, false);
    // }

    // (Overload where a participant can explicitly change the value of their prior vote)
    function vote(uint _voteCategoryId, uint _teamId, uint _value, bool _forceRevote) public onlyRegistered validTeamId(_teamId)
        returns (bool isSuccess_, bool indexOutOfRange_, bool alreadyVotedWarning_, bool valueOutOfRange_)
    {
        isSuccess_           = false;
        indexOutOfRange_     = false;
        alreadyVotedWarning_ = false;
        valueOutOfRange_     = false;
        
        if (numVoteCategories > _voteCategoryId && teams.length >= _teamId) {
            // Indices are in range for specified voteCat and team . . .

            if    (_value > voteCategories[_voteCategoryId].minValue
                && _value < voteCategories[_voteCategoryId].maxValue) 
            { 
                // `_value` is in the specified voting range for this voteCat scale

                alreadyVotedWarning_ = voteCategories[_voteCategoryId].voters[msg.sender][_teamId];
                if (alreadyVotedWarning_) {
                    // This participant has already voted on this team within this vote category!

                    // We won't assume they are changing their vote unless they explicity state they are
                    if (_forceRevote) {
                        // Find their previous vote and update it . . .

                        for (uint i = 0; i < voteCategories[_voteCategoryId].numVotes; i++) {
                            if (voteCategories[_voteCategoryId].votes[i].voter == msg.sender 
                                && voteCategories[_voteCategoryId].votes[i].teamId == _teamId) 
                            {
                                voteCategories[_voteCategoryId].votes[i].value = _value;
                                
                                isSuccess_ = true;
                                break;
                            }
                        }
                    }
                    else {
                        // Since `_forceRevote` wasn't provided, we just won't do anything here
                        // (being explicit with this empty if)
                    }
                }
                else {
                    // This member hasn't voted yet . . .

                    voteCategories[_voteCategoryId].voters[msg.sender][_teamId] = true;
                    voteCategories[_voteCategoryId].votes[voteCategories[_voteCategoryId].numVotes] = 
                        Vote({
                            voter:   msg.sender,
                            teamId: _teamId,
                            value:  _value
                        });
                        
                    voteCategories[_voteCategoryId].numVotes++;

                    isSuccess_ = true;
                }
            }
            else {
                valueOutOfRange_ = true;
            }
        }
        else {
            indexOutOfRange_ = true;
        }
    }

    function voted(uint _vcId, address _p, uint _teamId) public view returns (bool) 
    {
       return voteCategories[_vcId].voters[_p][_teamId];
    }

    function getVoteVal(uint _vcId, address _p, uint _teamId) public view returns (uint) 
    {
        for (uint i = 0; i < voteCategories[_vcId].numVotes; i++) {
            if (voteCategories[_vcId].votes[i].voter == _p
                && voteCategories[_vcId].votes[i].teamId == _teamId) 
            {
                return voteCategories[_vcId].votes[i].value;
            }
        }
        revert();
    }

    // vote-tallying

    // function getWinningTeamsForCategory(uint _voteCategoryId) public view returns (uint[] teamIds_) {
    //     (teamIds_,) = getWinningTeamsForCategory(_voteCategoryId, true, false);
    // }

    // (Overload to support exclusion of votes for "self" by all team members)
    function getWinningTeamsForCategory(uint _vcId, bool _includeSelfishVotes, bool _includeNonMembers) 
        public view returns (uint[] memory teamIds_, uint winningScore_)
    {
        assert(numVoteCategories > _vcId);

        uint[] memory teamSums = new uint[](teams.length);
        for (uint i = 0; i < voteCategories[_vcId].numVotes; i++) {
            // We'll check if the voter is still a registered participant before we count their vote . . . 
            // (Also check if voter is a part of _any_ team (this behavior is optional — depending on `_includeNonMembers` flag))
            if (registeredParticipants[voteCategories[_vcId].votes[i].voter]
                && (_includeNonMembers || registeredMembers[voteCategories[_vcId].votes[i].voter] > 0)) 
            {
                // If we're not including "selfish" votes, that means we don't include the vote value if it is for 
                // the team that the participant is a member of . . .
                if (_includeSelfishVotes 
                    || voteCategories[_vcId].votes[i].teamId != registeredMembers[voteCategories[_vcId].votes[i].voter])
                {
                    teamSums[voteCategories[_vcId].votes[i].teamId - 1] += voteCategories[_vcId].votes[i].value;
                }
            }
        }

        (teamIds_, winningScore_) = calculateWinningTeams(teamSums);
    }

    function getBestInShow(bool _includeSelfishVotes, bool _includeNonMembers) public view returns (uint[] teamIds_) {
        uint[] memory teamSums = new uint[](teams.length);
        for (uint i = 0; i < numVoteCategories; i++) {
            if (voteCategories[i].isActive) {
                var (winningTeams, winningAmount) = getWinningTeamsForCategory(i, _includeSelfishVotes, _includeNonMembers);
                for (uint j = 0; j < winningTeams.length; j++) {
                    teamSums[winningTeams[j] - 1] += winningAmount;
                }
            }
        }

        (teamIds_,) = calculateWinningTeams(teamSums);
    }

    function calculateWinningTeams(uint[] memory _teamSums) private pure returns (uint[] memory winningTeamIds_, uint winningScore_) {
        winningScore_     = 0;
        uint winningCount = 0; // initially used to track number of teams at the winning score

        for (uint j = 0; j < _teamSums.length; j++) {
            if (_teamSums[j] > winningScore_) {
                winningCount  = 1;
                winningScore_ = _teamSums[j];
            }
            else if (_teamSums[j] == winningScore_) {
                winningCount++;
            }
        }

        winningTeamIds_ = new uint[](winningCount);
        winningCount    = 0; // reusing variable because stack is shallow — now used to set value at index of `winningTeamIds_` array
        for (uint k = 0; k < _teamSums.length; k++) {
            if (_teamSums[k] == winningScore_) {
                winningTeamIds_[winningCount] = k + 1;
                winningCount++;
            }
        }
    }
}