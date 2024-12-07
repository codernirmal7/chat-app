import { Request, Response } from "express";

const userData = async (req: Request, res: Response): Promise<void> => {
  try {
    // `req.userData` contains the user object attached by the verifyToken middleware
    const user = req.userData;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error.", success: false });
  }
};

export { userData };
