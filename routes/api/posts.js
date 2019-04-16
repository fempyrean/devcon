const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Model
const Post = require('../../models/Post');
// Profile Model
const Profile = require('../../models/Profile');

// Post validation
const validatePostInput = require('../../validation/post');

/**
 * @route POST api/posts
 * @description Create a post
 * @access Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

	const { errors, isValid } = validatePostInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	// Creating post
	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	});

	// Saving post
	const savePost = newPost.save();
	savePost.then(post => res.json(post));
	savePost.catch(err => res.json(err));
});

/**
 * @route GET api/posts/
 * @description Returns all posts
 * @access Public
 */
router.get('/', (req, res) => {
	const findPosts = Post.find().sort({ date: -1 });
	findPosts.then(posts => res.status(200).json(posts));
	findPosts.catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

/**
 * @route GET api/posts/:id
 * @description Get post by id
 * @access Public
 */
router.get('/:id', (req, res) => {
	const findPost = Post.findById(req.params.id);
	findPost.then(post => res.status(200).json(post));
	findPost.catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

/**
 * @route DELETE api/posts/:id
 * @description Deletes a post
 * @access Private
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Finding post
	const findProfile = Profile.findOne({ user: req.user.id });
	findProfile.then(profile => {
		// Find post
		const findPost = Post.findById(req.params.id);
		findPost.then(post => {
			// Checking post owner
			if (post.user.toString() !== req.user.id) {
				return res.status(401).json({ notauthorized: 'User not authorized' });
			}

			// Delete post
			const removePost = post.remove();
			removePost.then(() => res.json({ success: true }));
			removePost.catch(err => res.status(404).json({ postnotfound: 'No post found for this id' }));
		})
		findPost.catch(err => res.json(err));
	})
	findProfile.catch(err => res.json(err));
})

/**
 * @route POST api/posts/like/:id
 * @description Likes a post
 * @access Private
 */
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Find profile
	const findProfile = Profile.findOne({ user: req.user.id });
	findProfile.then(profile => {
		// Find post by id
		const findPost = Post.findById(req.params.id);
		findPost.then(post => {
			// Check if the user has already liked the post
			const hasLike = post.likes.filter(like => like.user.toString() === req.user.id);
			if (hasLike.length > 0) {
				// User already liked this post
				return res.status(400).json({ alreadyliked: 'User already liked this post' });
			}

			// User has not liked the post, we'll add user's id to post's like array
			post.likes.unshift({ user: req.user.id });
			// Saving
			const savePost = post.save();
			savePost.then(post => res.json(post));
			savePost.catch(err => res.json({ errorSaving: 'Something went wrong while saving your data to the database' }));
		});
		findPost.catch(err => res.json(err));

	});
	findProfile.catch(err => res.status(404).json(err));
});

/**
 * @route POST api/posts/unlike/:id
 * @description Unlike a post
 * @access Private
 */
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Find user's profile
	const findProfile = Profile.findOne({ user: req.user.id });
	findProfile.then(profile => {
		// Find post by id
		const findPost = Post.findById(req.params.id);
		findPost.then(post => {
			// Check if the user has liked the post
			const hasLiked = post.likes.filter(like => like.user.toString() === req.user.id);
			if (hasLiked.length === 0) {
				// User has not liked this post
				return res.status(400).json({ notLiked: 'User has not liked this post' });
			}

			// User has liked, let's remove the like
			const indexes = post.likes.map(like => like.user.toString());
			const removeIndex = indexes.indexOf(req.params.id);

			// Removing like
			post.likes.splice(removeIndex, 1);

			// Saving
			const savePost = post.save();
			savePost.then(post => res.json(post));
			savePost.catch(err => res.json(err));
			
		});
		findPost.catch(err => res.json(err));
	})
	findProfile.catch(err => res.json(err));
})

/**
 * @route POST api/posts/comment/:id
 * @description Add a comment to a post
 * @access Private
 */
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validating comment
	const { errors, isValid } = validatePostInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	// Find post
	const findPost = Post.findById(req.params.id);
	findPost.then(post => {
		// Here, we have the post, let's create a comment object
		const newComment = {
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id
		};

		// Add to comments array
		post.comments.unshift(newComment);

		// Saving
		const savePost = post.save();
		savePost.then(post => res.json(post));
		savePost.catch(err => res.status(404).json(err));
		
	});
	findPost.catch(err => res.json(err));
	// Add comment to post
});

/**
 * @route DELETE api/posts/comment/:id
 * @description Deletes a comment from a post
 * @access Private
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Find post
	const findPost = Post.findById(req.params.id);
	findPost.then(post => {
		// Check if the comment exists
		const comment = post.comments.filter(comment => comment._id.toString() === req.params.comment_id);
		if (comment.lenght === 0) {
			// Comment doesn't exist, return an error
			return res.status(404).json({ commentNotFound: 'No comment found for this id' });
		}

		// Comment exists, let's remove it
		const indexes = post.comments.map(comment => comment._id.toString());
		const removeIndex = indexes.indexOf(req.params.comment_id);

		// Removing
		post.comments.splice(removeIndex, 1);

		// Saving
		const savePost = post.save();
		savePost.then(post => res.json({ success: true }));
		savePost.catch(err => res.json(err));
	});
})

module.exports = router;