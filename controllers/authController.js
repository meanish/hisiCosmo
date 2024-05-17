const authService = require('../services/authService');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await authService.login(username, password);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



const logout = async (req, res) => {
    /* logout logics connects to dB interact respponse */
};


const register = async (req, res) => {
    const formData = req.body
    try {
        const result = await authService.register({ formData })
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(401).json(result);
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });

    }
}

module.exports = {
    login,
    logout,
    register
};