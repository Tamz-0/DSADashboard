class Solution {
public:
    int totalFruit(vector<int>& fruits) {
        unordered_map<int, int> f;
        int l=0;
        int h=0;
        
        int res=INT_MIN;
        for(h;h<fruits.size();h++){
            f[fruits[h]]++;
            while(f.size()>2){
                f[fruits[l]]--;
                if(f[fruits[l]]==0){
                    f.erase(fruits[l]);
                }
                l++;
            }
            int len=h-l+1;
            res=max(res,len);
        }
        return res;
        
    }
};