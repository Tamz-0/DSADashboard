class Solution {
    public int minMoves(int[] arr) {
        int min=arr[0];
        int moves=0;
        for(int i=1;i<arr.length;i++){
            if(arr[i]<min){
                min=arr[i];
            }
        }
        for(int i=0;i<arr.length;i++){
            moves+=arr[i]-min;
        }
        return moves;
    }
}