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
				"id": parseInt(request.params.id)
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
				"id": {
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

	// PATCH movies/{id}
	server.route({
		method: 'POST',
		path: '/movies/{id}',
		handler: function(request, reply) {
			let movie = request.payload;
			db.movies.update({
					_id: request.payload.id
				}, {
					$setOnInsert: {
						'id':movie.id,
						'title': movie.title,
						'original_title': movie.original_title,
						'original_language': movie.original_language,
						'popularity': movie.popularity,
						'overview': movie.overview,
						'release_date': movie.release_date,
						'poster_path': movie.poster_path
					},
					$inc: {
						'post_credits.yes': movie.post_credits.yes,
						'post_credits.no': movie.post_credits.no
					}
				}, {
					upsert: true
				},
				(err, result) => {
					if (err) {
						return reply(Boom.wrap(err, 'Internal MongoDB error'));
					}
					db.movies.find({
						"_id": movie.id
					}, (err, movies) => {

						if (err) {
							return reply(Boom.wrap(err, 'Internal MongoDB error'));
						}

						if (!movies) {
							return reply(Boom.notFound());
						}

						reply(movies[0]);
					});
				}
			);
		},
		config: {
			validate: {
				payload: Joi.object({
					_id: Joi.number().integer(),
					id: Joi.number().integer(),
					adult: Joi.boolean(),
					genre_ids: Joi.array(),
					original_language: Joi.string(),
					title: Joi.string(),
					backdrop_path: Joi.any(),
					popularity: Joi.number(),
					vote_count: Joi.number(),
					video: Joi.boolean(),
					vote_average: Joi.number(),
					original_title: Joi.string().min(1).max(50).required(),
					overview: Joi.string().allow('').optional(),
					release_date: Joi.string(),
					poster_path: Joi.any(),
					post_credits: {
						yes: Joi.number().integer().default(0),
						no: Joi.number().integer().default(0)
					}
				}).required().min(1)
			}
		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-movies'
};
