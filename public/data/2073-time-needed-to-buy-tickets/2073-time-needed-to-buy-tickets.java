class Solution {
    public int timeRequiredToBuy(int[] tickets, int k) {
        int c=0;
        for(int i=0;i<=k;i++){
            c+=Math.min(tickets[i],tickets[k]);
        }
        for(int i=k+1;i<tickets.length;i++){
            c+=Math.min(tickets[i],tickets[k]-1);
        }
        return c;
    }
}