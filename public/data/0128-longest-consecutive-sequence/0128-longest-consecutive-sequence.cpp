class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
     if(nums.size()==0)return 0;
     int res=0;
     unordered_set<int>s(nums.begin(),nums.end());
     for(int i:s){
        if(s.find(i-1)==s.end()){
            int len=1;
            int curr=i;
            while(s.find(curr+1)!=s.end()){
                curr++;
                len++;
            }
            res=max(len,res);
        }
     }
        return res;   
    }
};