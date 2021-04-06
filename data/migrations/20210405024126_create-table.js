
exports.up = async function(knex) {
    await knex.schema.createTable('classes', (table) => {
        table.increments('id')
        table.text('name').notNull
        table.text('type')
        table.text('date')
        table.text('duration')
        table.text('intensity')
        table.text('location');
        table.text('numberOfRegisteredAttendees')
        table.integer('maxClassSize')
    })
    .createTable("users", (tbl) => {
        tbl.uuid("id").primary();
        tbl.string("username", 128).notNullable().unique();
        tbl.string("password", 256).notNullable();
        tbl.string("role").notNullable().references("name").inTable("roles");
      })
      .createTable("roles", (tbl) => {
        tbl.increments("id");
        tbl.string("name").unique().notNullable();
      })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('classes')
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
