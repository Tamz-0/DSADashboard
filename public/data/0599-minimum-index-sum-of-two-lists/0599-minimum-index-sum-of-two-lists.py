class Solution:
    def findRestaurant(self, list1: List[str], list2: List[str]) -> List[str]:
        myDict = {}
        min_val = float("inf")
        result = []

        # Store indices of list1
        for i, item in enumerate(list1):
            myDict[item] = i

        # Traverse list2 and compute index sums
        for j, val in enumerate(list2):
            if val in myDict:
                curr_sum = j + myDict[val]

                if curr_sum < min_val:
                    min_val = curr_sum
                    result = [val]
                elif curr_sum == min_val:
                    result.append(val)

        return result
        