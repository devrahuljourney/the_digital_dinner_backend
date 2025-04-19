const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder, resource_type: "auto" };

        console.log("File details:", file);
        console.log("Cloudinary options:", options);

        if (height) {
            options.height = height;
        }

        if (quality) {
            options.quality = quality;
        }

        // 📌 Use eager transformation for video to get an immediate response
        if (file.mimetype.startsWith("video")) {
            options.eager = [{ format: "mp4", quality: "auto" }];
            options.resource_type = "video";
        }

        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, options);

        console.log("Cloudinary Upload Response:", uploadResult);

        if (!uploadResult || !uploadResult.secure_url) {
            throw new Error("Upload successful but no URL returned");
        }

        return uploadResult;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw new Error("Failed to upload file to Cloudinary");
    }
};




// exports.uploadVideoToCloudinary = async (file, folder) => {
//     const options = { folder, resource_type: "video" };

//     try {
//         const result = await cloudinary.uploader.upload(file.tempFilePath, options);
//         return result;
//     } catch (error) {
//         console.error("Error uploading video to Cloudinary:", error);
//         throw new Error("Failed to upload video to Cloudinary");
//     }
// };
