import express from 'express';
import {
  getDiscussions,
  createDiscussion,
  addComment,
  likeDiscussion
} from '../controllers/discussionController.js';

const router = express.Router();

router.route('/')
  .get(getDiscussions)
  .post(createDiscussion);

router.route('/:id/like')
  .post(likeDiscussion);

router.route('/:id/comments')
  .post(addComment);

export default router;
