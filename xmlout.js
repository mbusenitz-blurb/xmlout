#!/usr/bin/env node

'use strict';

var sqlite3 = require('sqlite3').verbose();
var fs = require( 'fs' )
var path = require( 'path' )
var program = require( 'commander' )
var mkdirP = require( 'mkdir-p' );


program
.version( '0.0.1' )
.option( '-o, --output [path]', 'output foder (defaults to output)' )
.arguments( '<input>' )
.action( (input) => {
	
	if (typeof program.output === 'undefined') 
	{
		program.output = 'output';
	}
	
	console.log( 'extracting', input, 'into', program.output );
	
	let db = new sqlite3.Database(input);
	db.serialize( () => {
		db.each("SELECT * FROM files", function(err, row) {
		 	if (err) throw err;
			
		 	if (row.filepath.match( /xml/ ))
		 	{
		 		var outFile = path.join( 'output', row.filepath )
		 		  , dirname = path.dirname( outFile );

		 		mkdirP( dirname, (err) => {

					console.log( row.filepath ); 

					fs.writeFile( path.join( 'output', row.filepath ), row.filecontent, (err) => {
						if (err) throw err;
					} );
				});  
			}
		});
	}); 
} ); 

program.parse( process.argv ); 

