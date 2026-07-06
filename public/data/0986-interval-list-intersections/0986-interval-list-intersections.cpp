class Solution {
public:
    vector<vector<int>> intervalIntersection(vector<vector<int>>& firstList, vector<vector<int>>& secondList) {
        vector<vector<int>>res;
        int i=0;int j=0;
        while(i<firstList.size()&&j<secondList.size()){
            int s=max(firstList[i][0],secondList[j][0]);
            int e=min(firstList[i][1],secondList[j][1]);
            if(e>=s){
                res.push_back({s,e});
            }
            if(firstList[i][1]<secondList[j][1]) i++;
            else j++;
        }
        return res;
    }
};