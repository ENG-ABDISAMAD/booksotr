import User from "../model/user.model.js";  // Hubi in dariiqa faylka uu sax yahay
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Hubi haddii isticmaale hore u jiray
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash erayga sirta ah
        const hashPassword = await bcryptjs.hash(password, 10);

        // Samee isticmaalaha cusub
        const createdUser = new User({
            fullname: fullname,
            email: email,
            password: hashPassword,
        });

        // Kaydi isticmaale cusub
        await createdUser.save();

        // Soo celi fariin guul ah
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
            },
        });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hubi haddii isticmaaluhu jiro
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Hubi haddii erayga sirta ah uu is waafaqo
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Soo celi fariin guul ah
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
