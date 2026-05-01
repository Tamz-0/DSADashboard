class Solution {
    public int findMaxLength(int[] arr) {
        int n=arr.length;
        HashMap<Integer,Integer>mp=new HashMap<>();
        mp.put(0,-1);
        int s=0;int maxlen=0;
        for(int i=0;i<n;i++){
            if(arr[i]==1){
                s++;
            }else{
                s--;
            }
            if(mp.containsKey(s)){
                maxlen=Math.max(maxlen,i-mp.get(s));
            }else{
                mp.put(s,i);
            }
            
        }
        return maxlen;
        
    }
}