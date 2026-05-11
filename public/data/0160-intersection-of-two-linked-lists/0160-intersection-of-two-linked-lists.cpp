/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */

class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        ListNode* lista = headA;
        ListNode* listb = headB;

        while (lista != listb) {
            lista = (lista != nullptr) ? lista->next : headB;
            listb = (listb != nullptr) ? listb->next : headA;
        }

        return lista;        
    }
};