class Solution {
    int arr[101][101]={};
    
public:
    int uniquePaths(int m, int n) {
        if(m==0||n==0)return 0;
        if(m==1||n==1)return 1;
        if(arr[m][n]!=0)return arr[m][n];
        return arr[m][n]=uniquePaths(m-1,n)+uniquePaths(m,n-1);
    }
};