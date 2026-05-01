class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        vector<int>pos;
        vector<int>neg;
        int n=nums.size();
        for(int i=0;i<n;i++){
            if(nums[i]>=0){
                pos.push_back(nums[i]);
            }
            else{
                neg.push_back(nums[i]);
            }
        }
        int m=pos.size();
        int l=neg.size();
        if(pos.size()==0){
            for(int i=0;i<l;i++){
                neg[i]=neg[i]*neg[i];
            }
            reverse(neg.begin(),neg.end());
            return neg;
            
        }
        else if(neg.size()==0){
            for(int i=0;i<m;i++){
                pos[i]=pos[i]*pos[i];
            }
            return pos;
        }
        else{
            for(int i=0;i<m;i++){
                pos[i]=pos[i]*pos[i];
            }
            for(int i=0;i<l;i++){
                neg[i]=neg[i]*neg[i];
            }
            reverse(neg.begin(),neg.end());
            int i=0;
            int j=0;
            int k=0;
            while(i<m&&j<l){
                if(pos[i]>neg[j]){
                    nums[k]=neg[j];
                    j++;
                    k++;
                }
                else if(pos[i]<neg[j]){
                    nums[k]=pos[i];
                    i++;
                    k++;
                }
                else{
                    nums[k]=pos[i];
                    k++;
                    i++;
                    nums[k]=neg[j];
                    k++;
                    j++;
                }
            }
            while(i<m){
                nums[k]=pos[i];
                i++;
                k++;
            }
            while(j<l){
                nums[k]=neg[j];
                j++;
                k++;
            }
            return nums;
        }
        
    }
};