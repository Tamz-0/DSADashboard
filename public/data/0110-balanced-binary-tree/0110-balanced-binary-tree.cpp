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
    int height(TreeNode* root){
        if(!root)return 0;
        queue<TreeNode*>q;
        int h=0;
        q.push(root);
        while(!q.empty()){
            int s=q.size();
            while(s--){
                TreeNode* t=q.front();
                q.pop();
                if(t->left)q.push(t->left);
                if(t->right)q.push(t->right);
            }
            h++;
        }
        return h;
    }
    bool isBalanced(TreeNode* root) {
        if(!root)return 1;
        queue<TreeNode*>q;
        q.push(root);
        while(!q.empty()){
            TreeNode* t=q.front();
            q.pop();
            int lh=height(t->left);
            int rh=height(t->right);
            if(abs(lh-rh)>1)return 0;
            if(t->left)q.push(t->left);
            if(t->right)q.push(t->right);
        }
        return 1;
    }
};