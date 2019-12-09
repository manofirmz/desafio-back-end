const { promisify } = require('util');
const crypto = require('crypto');
const jsonWebToken = require('jsonwebtoken');
const tokenConfig = require('../../../config/token');
const Tedis = require('../../services/Tedis');

class Token {
    constructor () {
        this._tedis = Tedis;
    }

    async generate ({ id }) {
        try {
            const buffer = await promisify(crypto.randomBytes)(5);
            const jti = buffer.toString('hex');
            
            return await promisify(jsonWebToken.sign)({ id, jti }, tokenConfig.secret, {
                expiresIn: tokenConfig.ttl
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async isValid (jwt) {
        try {
            return await promisify(jsonWebToken.verify)(jwt, tokenConfig.secret);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async revoke (jwt) {
        try {
            const payload = await this.isValid(jwt);
            const key = this._key(payload);
            const expiresIn = this._expiresIn(payload);
    
            return await this._tedis.setex(key, parseInt(expiresIn), JSON.stringify(payload));
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async isBlacklisted (jwt) {
        try {
            const key = this._key(jwt);
            
            return await this._tedis.get(key);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    _key ({ jti }) {
        return `token:${jti}`;
    }
    
    _expiresIn ({ exp }) {
        return exp - (new Date().getTime() / 1000);
    }
}

module.exports = Token;
