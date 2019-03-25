pragma solidity ^0.5.0;

interface ReviewRegistry {

    //Update reviewer state depending on paper/work and review
    function contabilize(address _reviewer, 
                        address _paper,
                        address _workInPaper, 
                        string calldata _identifier, 
                        bool _isAccepted) external;

    //calcule factor between 0 - 100 depending on number of reviews and number of rights and wrongs
    function calculeFactor(address _reviewer, address _paper, address _work) public view 
                                returns(uint papers,
                                        uint papersOnTopic,
                                        uint reviews,
                                        uint reviewsOnTopic,
                                        uint reviewFactor, 
                                        uint reviewFactorOnTopic);

}