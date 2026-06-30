const authService = require("../services/auth.service");

exports.register = async (req, res) => {
    try {
        const result = await authService.register(req.body);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const result = await authService.verifyEmail(req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const result = await authService.forgotPassword(req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.verifyForgotPassword = async (req, res) => {
    try {
        const result =
            await authService.verifyForgotPassword(req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const result =
            await authService.resetPassword(req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const result =
            await authService.changePassword(
                req.user.id,
                req.body
            );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const result =
            await authService.refreshToken(req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const result =
            await authService.logout(req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};