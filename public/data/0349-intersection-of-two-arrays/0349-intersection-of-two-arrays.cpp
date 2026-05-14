class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        if(nums1.size() == 0 && nums2.size() == 0){
            if(nums1 == nums2) return nums1;
            else return {};
        }
        sort(nums1.begin(), nums1.end());
        sort(nums2.begin(), nums2.end());
        int l=0, r = 0;
        vector<int> insec;
        while(l<nums1.size() && r<nums2.size()){
            if(nums1[l] == nums2[r]){
                insec.push_back(nums1[l]);
                l++;
                r++;
            }
            else if(nums1[l] > nums2[r]){
                r++;
            }
            else l++;
        }
        if(insec.size() == 0) return insec;
        vector<int> set = {insec[0]};
        for(int i=1; i<insec.size(); i++){
            if(insec[i] != insec[i-1]) set.push_back(insec[i]);
        }
        return set;
    }
};