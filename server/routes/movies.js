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

	// POST movies
	server.route({
		method: 'POST',
		path: '/movies',
		handler: function(request, reply) {
			let movies = request.payload;
			for (let movie of movies) {
				movie._id = movie.id;
			}
			db.movies.insert(movies, (err, result) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}
				reply(movies);
			},
			{upsert: true}
			);
		},
		config: {
			validate: {
				payload: Joi.array().items(Joi.object({
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
					original_title: Joi.string().min(1).max(50).required(),
					overview: Joi.string().allow('').optional(),
					release_date: Joi.string(),
					poster_path: Joi.any(),
					post_credits: {
						yes: Joi.number().integer(),
						no: Joi.number().integer()
					}
				}))
			}
		}
	});

	// // PATCH movies/{id}/poll
	// server.route({
	// 	method: 'PATCH',
	// 	path: '/movies/{id}/poll',
	// 	handler: function(request, reply) {
	// 		db.movies.update({
	// 			_id: request.params.id
	// 		}, {
	// 			$set: {
	// 				$inc: {
	// 					post_credits: {
	// 						yes: request.payload.post_credits.yes,
	// 						no: request.payload.post_credits.no
	// 					}
	// 				}
	// 			}
	// 		}, function(err, result) {
	//
	// 			if (err) {
	// 				return reply(Boom.wrap(err, 'Internal MongoDB error'));
	// 			}
	//
	// 			if (result.n === 0) {
	// 				return reply(Boom.notFound());
	// 			}
	// 			reply(movie);
	// 		});
	// 	}
	// });

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

	// server.route({
	// 	method: 'POST',
	// 	path: '/movies/{id}/poll',
	// 	handler: function(request, reply) {
	// 		let yesIncrementValue = 0;
	// 		let noIncrementValue = 0;
	// 		switch (request.payload.vote_type) {
	// 			case 'YES':
	// 				yesIncrementValue++;
	// 				break;
	// 			case 'CHANGE_TO_YES':
	// 				yesIncrementValue++;
	// 				noIncrementValue--;
	// 				break;
	// 			case 'NO':
	// 				noIncrementValue++;
	// 				break;
	// 			case 'CHANGE_TO_NO':
	// 				yesIncrementValue--;
	// 				noIncrementValue++;
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 		console.log(yesIncrementValue,noIncrementValue);
	// 		db.movies.update(
	// 			{"id": parseInt(request.params.id)},
	// 			{ $set: {
	// 				"post_credits": { "yes": yesIncrementValue, "no": noIncrementValue }
	// 			}},
	// 			function(err, result) {
	// 			if (err) {
	// 				return reply(Boom.wrap(err, 'Internal MongoDB error'));
	// 			}
	// 			if (result.n === 0) {
	// 				return reply(Boom.notFound());
	// 			}
	// 			reply('Updated').code(204);
	// 			}
	// 		);
	// 	}
	// });

	// DELETE movies/{id}
	// server.route({
	// 	method: 'DELETE',
	// 	path: '/movies/{id}',
	// 	handler: function(request, reply) {
	//
	// 		db.movies.remove({
	// 			_id: request.params.id
	// 		}, function(err, result) {
	//
	// 			if (err) {
	// 				return reply(Boom.wrap(err, 'Internal MongoDB error'));
	// 			}
	//
	// 			if (result.n === 0) {
	// 				return reply(Boom.notFound());
	// 			}
	//
	// 			reply().code(204);
	// 		});
	// 	}
	// });

	return next();
};

exports.register.attributes = {
	name: 'routes-movies'
};
