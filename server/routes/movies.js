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

				db.movies.update(docs, (err, result) => {
					for(doc of docs){
						doc._id = doc.id;
					}
					if (err) {
						return reply(Boom.wrap(err, 'Internal MongoDB error'));
					}
					reply(docs);
				},
				{
					upsert:true,
					multi:true
				});

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

	// POST movies
	server.route({
		method: 'POST',
		path: '/movies',
		handler: function(request, reply) {
			let movie = request.payload;
			movie._id = movie.id;
			db.movies.insert(movie, (err, result) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				reply(movie);
			});
		},
		config: {
			validate: {
				payload: Joi.object({
					id: Joi.number().integer(),
					"adult": Joi.boolean(),
				  "genre_ids": Joi.array(),
					"original_language": Joi.string(),
					"title": Joi.string(),
					"backdrop_path": Joi.any(),
					"popularity": Joi.number(),
					"vote_count": Joi.number(),
					"video": Joi.boolean(),
					"vote_average": Joi.number(),
					original_title: Joi.string().min(1).required(),
					overview: Joi.string().allow('').optional(),
					release_date: Joi.string().allow(''),
					poster_path: Joi.any(),
					post_credits: {
						yes: Joi.number().integer(),
						no: Joi.number().integer()
					}
				})
			}
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
		method: 'PATCH',
		path: '/movies/{id}',
		handler: function(request, reply) {
			db.movies.find({
				"id": {
					$in: request.params.id
				}
			}, (err, movie) => {
				if(movie){
					request.payload.post_credits.yes = movie.post_credits.yes + request.payload.post_credits.yes;
	 				request.payload.post_credits.yes = movie.post_credits.no + request.payload.post_credits.no;
				} else {
					request.payload._id = request.payload.id
				}
				db.movies.update({
					"id": parseInt(request.payload.id)
				}, {
					$set: request.payload
				}, function(err, result) {
					if (err) {
						return reply(Boom.wrap(err, 'Internal MongoDB error'));
					}
					if (result.n === 0) {
						return reply(Boom.notFound());
					}
					reply('Updated').code(204);
				}, {
					upsert: true
				});
				reply(movie);
			});
		},
		config: {
			validate: {
				payload: Joi.object({
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
