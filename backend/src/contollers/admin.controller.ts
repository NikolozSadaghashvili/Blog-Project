import { Request, Response } from "express";
export const securtyPassword = async (req: Request, res: Response) => {
  const myBestKey = "va12va12";
  const { password } = req.body;
  if (myBestKey !== password) {
    return res
      .status(403)
      .json({ success: false, message: "password is not correct" });
  }

  res.status(200).json({
    success: true,
    message: "password successfully",
  });
};
