var mongoose = require('mongoose')
    , accountSchema = new mongoose.Schema({ access_token: 'string',
                                    user: { username: 'string',
                                       bio: 'string',
                                       website: 'string',
                                       profile_picture: 'string',
                                       full_name: 'string',
                                       id: 'number' }
                              })
    , schema = new mongoose.Schema({ username: 'string', password: 'string',
                                   token: 'string',
                                   accounts: [accountSchema],
                                })
    , User = mongoose.model('User', schema);

module.exports = User;
