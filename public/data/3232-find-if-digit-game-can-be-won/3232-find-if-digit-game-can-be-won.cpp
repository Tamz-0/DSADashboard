class Solution {
public:
    bool canAliceWin(vector<int>& nums) {
        int cs=0;
        int cd=0;
        for(int i : nums){
            if(i<10)cs+=i;
            else cd+=i;
        }
        return cs!=cd;
        
    }
};