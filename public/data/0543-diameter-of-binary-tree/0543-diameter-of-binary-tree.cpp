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
    int diameterOfBinaryTree(TreeNode* root) {
        if(!root)return 0;
        queue<TreeNode*>q;
        q.push(root);
        int d=0;
        while(!q.empty()){
            TreeNode* t=q.front();
            q.pop();
            d=max(d,height(t->left)+height(t->right));
            if(t->left)q.push(t->left);
            if(t->right)q.push(t->right);
        }
        return d;
    }
};