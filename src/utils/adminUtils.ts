/**
 * Utility functions for managing admin status
 * Note: In a real application, this would be part of a secure authentication system
 * and not rely on localStorage which can be easily manipulated by users
 */


export const setAdminStatus = (isAdmin: boolean) => {
    if(isAdmin){
        localStorage.setItem('userRole', 'admin');
    }else{
        localStorage.removeItem('userRole');
    }
};


export const checkIsAdmin = (): boolean =>{
    return localStorage.getItem('useRole') === 'admin';
};

export const toggleAdminStatus = (): boolean =>{
    const currentStatus = checkIsAdmin();
    setAdminStatus(!currentStatus);
    return !currentStatus;
}