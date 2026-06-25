class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        while(stones.size()>1){
            sort(stones.begin(),stones.end());
            int n=stones.size();
            int x=stones[n-1];
            int y=stones[n-2];
            
                stones.pop_back();
                stones.pop_back();
                if(x!=y)stones.push_back(x-y);


        }
        return stones.empty()?0:stones[0];
        
    }
};