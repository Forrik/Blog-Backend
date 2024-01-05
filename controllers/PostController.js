import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        post.viewsCount += 1;

        await post.save();

        res.json(post);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось получить статью",
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Статья не найдена"
            });
        }

        if (post.user.toString() !== userId) {
            return res.status(403).json({
                message: "Нет доступа к удалению статьи"
            });
        }

        const deletedPost = await PostModel.findByIdAndDelete({
            _id: postId
        });

        return res.json({
            message: "Статья успешно удалена"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Ошибка при удалении статьи"
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Статья не найдена"
            });
        }

        if (post.user.toString() !== userId) {
            return res.status(403).json({
                message: "Нет доступа к редактированию статьи"
            });
        }

        post.title = req.body.title;
        post.text = req.body.text;
        post.imageUrl = req.body.imageUrl;
        post.tags = req.body.tags;

        await post.save();

        res.json({
            success: true
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}