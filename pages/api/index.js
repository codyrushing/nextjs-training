import connect from 'next-connect';

export default connect()
  .use(
    (req, res, next) => {
      console.log('got an API route');
      next('Something bad happened');
    }
  )