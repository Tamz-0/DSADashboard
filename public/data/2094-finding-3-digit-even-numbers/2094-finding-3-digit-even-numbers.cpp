class Solution {
public:
    vector<int> findEvenNumbers(vector<int>& digits) {
        vector<int>res;
        set<int>st;
        int n=digits.size();
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                for(int k=0;k<n;k++){
                    if(i==j||i==k||j==k) continue;
                    if(digits[i]==0)continue;
                    if(digits[k]%2==1)continue;
                    int temp=(digits[i]*100)+(digits[j]*10)+digits[k];
                    st.insert(temp);
                }
            }
        }
        for(int i:st){
            res.push_back(i);
        }
        return res;
    }
};