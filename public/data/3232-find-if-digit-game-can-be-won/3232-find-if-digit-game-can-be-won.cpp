class Solution {
public:
    bool canAliceWin(vector<int>& nums) {
    int od=0;
    int dd=0;
    for(int i:nums){
        if(i>=10){
            dd+=i;
        }else{
            od+=i;
        }
    }
    return od!=dd;
    }
};