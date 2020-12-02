import connect from 'next-connect';

const handler = connect()
  .get(
    (req, res) => {
      res.json({ message: 'ok' })
    }
  )
  .post(
    (req, res) => {
      res.json({ message: 'posted'})
    }
  )

export default handler;