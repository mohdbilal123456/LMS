import uploadImage from "../config/cloudinary.js"
import upload from "../middleware/multer.js"
import Course from "../models/courseModel.js"
import Lecture from "../models/lectureModel.js"
import User from '../models/userModel.js'

export const createCourse = async (req, res) => {
      try {
            const { title, category } = req.body
            if (!title || !category) {
                  return res.status(400).json({ message: 'title or category is required' })
            }
            const course = await Course.create({
                  title, category, creators: req.userId
            })


            return res.status(201).json(course)
      }
      catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'Create course Error !' })
      }
}


export const getPublishCourses = async (req, res) => {
      try {
            const courses = await Course.find({ isPublished: true })
                  .populate('reviews')
                  .populate('lectures');
            if (!courses.length) {
                  return res.status(404).json({ message: 'Courses Not Found' });
            }

            return res.status(200).json(courses);
      } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Publish course Error!' });
      }
};


export const getCreatorCourses = async (req, res) => {
      try {
            const userId = req.userId
            const courses = await Course.find({ creators: userId })
            if (!courses) {
                  return res.status(200).json({ message: 'Courses Not Found' })
            }
            // console.log('courses', courses)
            return res.status(200).json(courses)
      }
      catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'Getcourse Error !' })
      }
}

export const editCourse = async (req, res) => {
      try {
            const { courseId } = req.params;
            const { title, subTitle, description, category, level, isPublished, price } = req.body;

            let thumbNail;

            // ✅ If a new image is uploaded, upload to cloud
            if (req.file) {
                  thumbNail = await uploadImage(req.file.path);
            }

            // ✅ Find existing course
            let course = await Course.findById(courseId);
            if (!course) {
                  return res.status(400).json({ message: "Course Not Found!" });
            }

            // ✅ Build update object safely
            const updateData = {
                  title: title ?? course.title,
                  subTitle: subTitle ?? course.subTitle,
                  description: description ?? course.description,
                  category: category ?? course.category,
                  level: level ?? course.level,
                  isPublished: isPublished ?? course.isPublished,
                  price: price ?? course.price,
                  thumbNail: thumbNail || course.thumbNail, // preserve old image if no new file
            };

            // ✅ Update course
            course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

            return res.status(200).json(course);
      } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Edit Course Error!" });
      }
};


export const getCourseById = async (req, res) => {
      try {
            const { courseId } = req.params
            const course = await Course.findById(courseId)
                  .populate('lectures reviews')

            if (!course) return res.status(400).json({ message: 'Course Not Found !' })
            return res.status(200).json(course)
      } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Failed to get Course' })
      }
}


export const removeCourse = async (req, res) => {
      try {
            const { courseId } = req.params
            let course = await Course.findById(courseId)

            if (!course) {
                  return res.status(400).json({ message: 'Course Not Found !' })
            }
            course = await Course.findByIdAndDelete(courseId, { new: true })
            return res.status(200).json({ message: 'Course Removed !' })
      }
      catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'Failed To Removed Course !' })
      }
}


// For Lectures 

export const createLecture = async (req, res) => {
      try {
            const { lectureTitle } = req.body;
            const { courseId } = req.params;

            if (!lectureTitle || !courseId) {
                  return res.status(400).json({ message: "Lecture title is required" });
            }

            const lecture = await Lecture.create({ lectureTitle });
            const course = await Course.findById(courseId);

            if (!course) return res.status(404).json({ message: "Course not found" });

            course.lectures.push(lecture._id);
            await course.save();

            await course.populate("lectures");
            return res.status(201).json({ lecture, lectures: course.lectures });
      } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to create lecture" });
      }
};


export const getCourseLecture = async (req, res) => {
      try {
            const { courseId } = req.params;
            const course = await Course.findById(courseId).populate("lectures");

            if (!course) return res.status(404).json({ message: "Course not found" });

            res.json({ lectures: course.lectures });
      } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to get lectures" });
      }
};


export const editLecture = async (req, res) => {

      try {
            const { lectureId } = req.params
            const { isPreviewFree, lectureTitle } = req.body
            let lecture = await Lecture.findById(lectureId)

            if (!lecture) {
                  return res.status(400).json({ message: 'lecture is not found' })
            }
            let videoUrl
            if (req.file) {
                  videoUrl = await uploadImage(req.file.path)
                  lecture.videoUrl = videoUrl;
            }

            if (lectureTitle) {
                  lecture.lectureTitle = lectureTitle
            }

            lecture.isPreviewFree = isPreviewFree
            await lecture.save()
            return res.status(200).json(lecture)
      }
      catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'Failed To Edit Lecture !' })
      }
}

export const removeLecture = async (req, res) => {
      try {
            const { lectureId } = req.params
            const lecture = await Lecture.findByIdAndUpdate(lectureId)

            if (!lecture) {
                  return res.status(400).json({ message: 'lecture is not found' })
            }
            await Course.updateOne(
                  { lectures: lectureId },
                  { $pull: { lectures: lectureId } }
            )
            return res.status(200).json({ message: 'Lecture Removed !' })
      }
      catch (error) {
            console.log(error)
            return res.status(400).json({ message: 'Failed To Remove Lecture !' })
      }
}

// get Creator
// controllers/userController.js
export const getCreatorById = async (req, res) => {
      try {
            const { userId } = req.body;

            const user = await User.findById(userId).select("-password"); // Exclude password

            if (!user) {
                  return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(user);
      } catch (error) {
            console.error("Error fetching user by ID:", error);
            res.status(500).json({ message: "get Creator error" });
      }
};

