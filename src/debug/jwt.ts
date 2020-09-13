import { IUserRole, default as JWT } from 'lib/dist/jwt'
import config from '../config'
import logger from '../logger'

const jwtConfig = config.jwt
// eslint-disable-next-line new-cap
const jwt = new JWT({
  issuer: jwtConfig.issuer,
  key: {
    public: jwtConfig.publkey,
    private: jwtConfig.privkey
  },
  subject: jwtConfig.subject,
  maxAge: jwtConfig.maxAge
})

const jwtObject = {
  id: 'test',
  authType: 'debig',
  role: IUserRole.Admin,
  name: 'testUser',
  image: ''
};

(async () => {
  const jwtToken = await jwt.createToken(jwtObject)

  logger.info(jwtToken)

  const jwtVerify = await jwt.verifyToken(jwtToken)

  logger.info(jwtVerify)
})()
