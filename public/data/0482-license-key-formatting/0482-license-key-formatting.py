class Solution(object):
    def licenseKeyFormatting(self, s, k):
        s = s.replace('-', '').upper()
        n = len(s)
        first_group = n % k or k
        res = [s[:first_group]]
        for i in range(first_group, n, k):
            res.append(s[i:i + k])
        return '-'.join(res)