class Solution {
    public int maximumSum(int[] arr) {
        int onedelete=Integer.MIN_VALUE;;
        int nodelete=arr[0];
        int ans=arr[0];
        for(int i=1;i<arr.length;i++){
            int prevonedelete=onedelete;
            int prevnodelete=nodelete;
            int v;
            if(prevonedelete==Integer.MIN_VALUE){
                v=arr[i];
            }else{
                v=prevonedelete+arr[i];
            }
            nodelete=Math.max(nodelete+arr[i],arr[i]);
            onedelete=Math.max(prevnodelete,v);
            int val=Math.max(nodelete,onedelete);
            ans=Math.max(val,ans);
        }
        return ans;

        
    }
}