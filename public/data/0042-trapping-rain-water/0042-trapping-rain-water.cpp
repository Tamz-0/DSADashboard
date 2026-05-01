class Solution {
public:
    int trap(vector<int>& height) {
        if(height.size()==0){
            return 0;
        }
        else{
        int l=0;int r=height.size()-1;
        int lmax=height[l];int rmax=height[r];
        int area=0;
        while(l<r){
            if (lmax<rmax){
                l++;
                lmax=max(lmax,height[l]);
                area+=lmax-height[l];

            }
            else{
                r--;
                rmax=max(rmax,height[r]);
                area+=rmax-height[r];

            }
        }

    return area;
    }
    }
};