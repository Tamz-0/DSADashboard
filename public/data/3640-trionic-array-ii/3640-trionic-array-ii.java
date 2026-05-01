class Solution {
    public long maxSumTrionic(int[] nums) {
        int n = nums.length;
        long NEG = Long.MIN_VALUE / 4;

        long up = NEG, down = NEG, up2 = NEG;
        long ans = NEG;

        for (int i = 1; i < n; i++) {
            long newUp = NEG, newDown = NEG, newUp2 = NEG;

            if (nums[i] > nums[i - 1]) {
                newUp = Math.max(
                        up == NEG ? NEG : up + nums[i],
                        (long) nums[i - 1] + nums[i]
                );
                newUp2 = Math.max(
                        down == NEG ? NEG : down + nums[i],
                        up2 == NEG ? NEG : up2 + nums[i]
                );
            }

            if (nums[i] < nums[i - 1]) {
                newDown = Math.max(
                        up == NEG ? NEG : up + nums[i],
                        down == NEG ? NEG : down + nums[i]
                );
            }

            up = newUp;
            down = newDown;
            up2 = newUp2;

            ans = Math.max(ans, up2);
        }

        return ans;
    }
}
