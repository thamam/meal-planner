// ==========================================
// 🔥 Firebase API Wrapper
// ==========================================
// This module replaces the fetch() calls to 'tables/*' endpoints
// with Firebase Firestore operations

const FirebaseAPI = {
    
    // ==========================================
    // Users Collection
    // ==========================================
    
    async getUser(userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    },
    
    async createUser(userData) {
        try {
            const docRef = await db.collection('users').add({
                ...userData,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...userData };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    
    async updateUser(userId, userData) {
        try {
            await db.collection('users').doc(userId).update({
                ...userData,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: userId, ...userData };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },
    
    async deleteUser(userId) {
        try {
            await db.collection('users').doc(userId).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },
    
    // ==========================================
    // Food Items Collection
    // ==========================================
    
    async getFoodItems(limit = 100) {
        try {
            const snapshot = await db.collection('food_items')
                .limit(limit)
                .get();
            
            const items = [];
            snapshot.forEach(doc => {
                items.push({ id: doc.id, ...doc.data() });
            });
            
            return { data: items };
        } catch (error) {
            console.error('Error getting food items:', error);
            throw error;
        }
    },
    
    async getFoodItem(foodId) {
        try {
            const doc = await db.collection('food_items').doc(foodId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting food item:', error);
            throw error;
        }
    },
    
    async createFoodItem(foodData) {
        try {
            const docRef = await db.collection('food_items').add({
                ...foodData,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...foodData };
        } catch (error) {
            console.error('Error creating food item:', error);
            throw error;
        }
    },
    
    // ==========================================
    // Composite Items Collection
    // ==========================================
    
    async getCompositeItems(limit = 100) {
        try {
            const snapshot = await db.collection('composite_items')
                .limit(limit)
                .get();
            
            const items = [];
            snapshot.forEach(doc => {
                items.push({ id: doc.id, ...doc.data() });
            });
            
            return { data: items };
        } catch (error) {
            console.error('Error getting composite items:', error);
            throw error;
        }
    },
    
    async getCompositeItem(itemId) {
        try {
            const doc = await db.collection('composite_items').doc(itemId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting composite item:', error);
            throw error;
        }
    },
    
    async updateCompositeItem(itemId, itemData) {
        try {
            await db.collection('composite_items').doc(itemId).update({
                ...itemData,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: itemId, ...itemData };
        } catch (error) {
            console.error('Error updating composite item:', error);
            throw error;
        }
    },
    
    // ==========================================
    // Custom Foods Collection
    // ==========================================
    
    async getCustomFoods(userId) {
        try {
            const snapshot = await db.collection('custom_foods')
                .where('user_id', '==', userId)
                .get();
            
            const items = [];
            snapshot.forEach(doc => {
                items.push({ id: doc.id, ...doc.data() });
            });
            
            return { data: items };
        } catch (error) {
            console.error('Error getting custom foods:', error);
            throw error;
        }
    },
    
    async createCustomFood(foodData) {
        try {
            const docRef = await db.collection('custom_foods').add({
                ...foodData,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...foodData };
        } catch (error) {
            console.error('Error creating custom food:', error);
            throw error;
        }
    },
    
    async deleteCustomFood(foodId) {
        try {
            await db.collection('custom_foods').doc(foodId).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting custom food:', error);
            throw error;
        }
    },
    
    // ==========================================
    // Meal Plans Collection
    // ==========================================
    
    async getMealPlans(userId, limit = 10) {
        try {
            const snapshot = await db.collection('meal_plans')
                .where('user_id', '==', userId)
                .orderBy('created_at', 'desc')
                .limit(limit)
                .get();
            
            const plans = [];
            snapshot.forEach(doc => {
                plans.push({ id: doc.id, ...doc.data() });
            });
            
            return { data: plans };
        } catch (error) {
            console.error('Error getting meal plans:', error);
            throw error;
        }
    },
    
    async getMealPlan(planId) {
        try {
            const doc = await db.collection('meal_plans').doc(planId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting meal plan:', error);
            throw error;
        }
    },
    
    async createMealPlan(planData) {
        try {
            const docRef = await db.collection('meal_plans').add({
                ...planData,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...planData };
        } catch (error) {
            console.error('Error creating meal plan:', error);
            throw error;
        }
    },
    
    async updateMealPlan(planId, planData) {
        try {
            await db.collection('meal_plans').doc(planId).update({
                ...planData,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: planId, ...planData };
        } catch (error) {
            console.error('Error updating meal plan:', error);
            throw error;
        }
    },
    
    async deleteMealPlan(planId) {
        try {
            await db.collection('meal_plans').doc(planId).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting meal plan:', error);
            throw error;
        }
    },
    
    // ==========================================
    // Shopping Lists Collection
    // ==========================================
    
    async getShoppingLists(userId, limit = 10) {
        try {
            const snapshot = await db.collection('shopping_lists')
                .where('user_id', '==', userId)
                .orderBy('created_at', 'desc')
                .limit(limit)
                .get();
            
            const lists = [];
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            
            return { data: lists };
        } catch (error) {
            console.error('Error getting shopping lists:', error);
            throw error;
        }
    },
    
    async createShoppingList(listData) {
        try {
            const docRef = await db.collection('shopping_lists').add({
                ...listData,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...listData };
        } catch (error) {
            console.error('Error creating shopping list:', error);
            throw error;
        }
    },
    
    // ==========================================
    // Rules Collection
    // ==========================================
    
    async getRules(userId) {
        try {
            const snapshot = await db.collection('rules')
                .where('user_id', '==', userId)
                .get();
            
            const rules = [];
            snapshot.forEach(doc => {
                rules.push({ id: doc.id, ...doc.data() });
            });
            
            return { data: rules };
        } catch (error) {
            console.error('Error getting rules:', error);
            throw error;
        }
    },
    
    async createRule(ruleData) {
        try {
            const docRef = await db.collection('rules').add({
                ...ruleData,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...ruleData };
        } catch (error) {
            console.error('Error creating rule:', error);
            throw error;
        }
    },
    
    async updateRule(ruleId, ruleData) {
        try {
            await db.collection('rules').doc(ruleId).update({
                ...ruleData,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: ruleId, ...ruleData };
        } catch (error) {
            console.error('Error updating rule:', error);
            throw error;
        }
    }
};

// Make FirebaseAPI globally available
window.FirebaseAPI = FirebaseAPI;

console.log('✅ Firebase API wrapper loaded');
