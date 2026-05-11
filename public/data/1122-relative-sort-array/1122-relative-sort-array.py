class Solution:
    def relativeSortArray(self, arr1: List[int], arr2: List[int]) -> List[int]:
        dict1 = dict()
        rem_elements = []
        for val in arr1:
            if val not in arr2 :
                rem_elements.append(val)
            dict1[val] = dict1.get(val,0)+1 #sets the. coutner for the elem coming in the arr1 &later used by to put tht val at the requried place

        rem_elements.sort()# as it is asked in question to Elements that do not appear in arr2 should be placed at the end of arr1 in ascending order.
        final_Arr = []#my final arr updated when ill be iterating over the arr2 array/list
        for val in arr2:
            # get the occurence of this val from dict1 as that many time we have to append it in the new final arr dict1[val] -> value
            for i in range(dict1[val]):
                final_Arr.append(val)
        for val in rem_elements:
            final_Arr.append(val)

        return final_Arr