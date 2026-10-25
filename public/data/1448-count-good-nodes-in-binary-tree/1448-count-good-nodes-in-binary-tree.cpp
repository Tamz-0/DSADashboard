/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int goodNodes(TreeNode* root) {
        if(!root)return 0;
        queue<pair<TreeNode*,int>>q;
        int c=0;
        q.push({root,root->val});
        while(!q.empty()){
            auto[t,mx]=q.front();
            q.pop();
            if(t->val>=mx)c++;
            mx=max(mx,t->val);
            if(t->left)q.push({t->left,mx});
            if(t->right)q.push({t->right,mx});
        }
        return c;
    }
};