'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function(server, options, next) {

	const db = server.app.db;

	// GET movies
	server.route({
		method: 'GET',
		path: '/movies',
		handler: function(request, reply) {

			db.movies.find((err, docs) => {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(docs);
			});

		}
	});

	// GET movies/{id}
	server.route({
		method: 'GET',
		path: '/movies/{id}',
		handler: function(request, reply) {

			db.movies.find({
				"moviedbid": parseInt(request.params.id)
			}, (err, doc) => {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (!doc) {
					return reply(Boom.notFound());
				}

				reply(doc[0]);
			});

		}
	});

	// POST movies/filter
	server.route({
		method: 'POST',
		path: '/movies/filter',
		handler: function(request, reply) {
			db.movies.find({
				"moviedbid": {
					$in: request.payload.movie_ids
				}
			}, (err, doc) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				if (!doc) {
					return reply(Boom.notFound());
				}
				reply(doc);
			});

		}
	});

	// POST movies
	server.route({
		method: 'POST',
		path: '/movies',
		handler: function(request, reply) {

			const movie = request.payload;

			//Create an id
			movie._id = uuid.v1();

			db.movies.find({
				"moviedbid": parseInt(request.payload.moviedbid) || null
			}, (err, doc) => {
				if (doc.length) {
					return reply('Movie already created');
				}
				db.movies.save(movie, (err, result) => {
					if (err) {
						return reply(Boom.wrap(err, 'Internal MongoDB error'));
					}
					reply(movie);
				});
			});

		},
		config: {
			validate: {
				payload: {
					moviedbid: Joi.number().integer(),
					original_title: Joi.string().min(1).max(50).required(),
					overview: Joi.string().min(1).required(),
					release_date: Joi.string(),
					poster_path: Joi.string().min(10).max(250),
					post_credits: {
						yes: Joi.number().integer(),
						no: Joi.number().integer()
					}
				}
			}
		}
	});

	// PATCH movies/{id}/poll
	server.route({
		method: 'PATCH',
		path: '/movies/{id}/poll',
		handler: function(request, reply) {
			db.movies.update({
				_id: request.params.id
			}, {
				$set: {
					$inc: {
						post_credits: {
							yes: request.payload.post_credits.yes,
							no: request.payload.post_credits.no
						}
					}
				}
			}, function(err, result) {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (result.n === 0) {
					return reply(Boom.notFound());
				}
				reply(movie);
			});
		}
	});

	// PATCH movies/{id}
	server.route({
		method: 'PATCH',
		path: '/movies/{id}',
		handler: function(request, reply) {

			db.movies.update({
				_id: request.params.id
			}, {
				$set: request.payload
			}, function(err, result) {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (result.n === 0) {
					return reply(Boom.notFound());
				}

				reply().code(204);
			}, {
				upsert: true
			});
		},
		config: {
			validate: {
				payload: Joi.object({
					moviedbid: Joi.number().integer(),
					original_title: Joi.string().min(1).max(50),
					overview: Joi.string().min(1),
					release_date: Joi.string(),
					poster_path: Joi.string().min(10).max(250),
					post_credits: {
						yes: Joi.number().integer().min(0).default(0),
						no: Joi.number().integer().min(0).default(0)
					}
				}).required().min(1)
			}
		}
	});

	// DELETE movies/{id}
	server.route({
		method: 'DELETE',
		path: '/movies/{id}',
		handler: function(request, reply) {

			db.movies.remove({
				_id: request.params.id
			}, function(err, result) {

				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (result.n === 0) {
					return reply(Boom.notFound());
				}

				reply().code(204);
			});
		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-movies'
};
