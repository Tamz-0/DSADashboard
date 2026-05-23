class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int l=0;
        int h=numbers.size()-1;
        int s=0;
        while(l<h){
            s=numbers[l]+numbers[h];
            if(s==target) return {l+1,h+1};
            else if(s>target) h--;
            else l++;
        }
        return {0,0};
        
    }
};