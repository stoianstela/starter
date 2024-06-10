const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');




exports.getCheckoutSession = catchAsync(async (req, res, next) =>
    {
        // 1) Get the currently booked tour

        const tour = await Tour.findById(req.params.tourId);
        console.log(tour);

        // 2) Create checkout session

        const product = await stripe.products.create({
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`http://127.0.0.1:3000/img/tours/${tour.imageCover}`],
          });
         
          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: tour.price * 100,
            currency: 'usd',
          });

          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
            cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
            customer_email: req.user.email,
            client_reference_id: req.params.tourID,
            mode: 'payment',
            line_items: [
              {
                price: price.id,
                quantity: 1,
              },
            ],
        });

        

        // 3) Create session as response
        res.status(200).json({
            status: 'success',
            session
        });

    });


    exports.createBookingCheckout = catchAsync( async (req, res, next) => {
      //This is only TEMPORARY
      const {tour, user, price}=req.query;
      if(!tour && !user & !price) return next();
      await Booking.create ({tour, user, price})

      res.redirect(req.originalUrl.split('?')[0]);
    });


    exports.createBooking = factory.createOne(Booking);
    exports.getBooking = factory.getOne(Booking);
    exports.getAllBookings = factory.getAll(Booking);
    exports.updateBooking = factory.updateOne(Booking);
    exports.deleteBooking = factory.deleteOne(Booking);

    exports.checkIfBooked = catchAsync(async (req, res, next) => {
      // To check if booked was bought by user who wants to review it
      const booking = await Booking.find({ user: req.user.id, tour: req.body.tour });
      if (booking.length === 0) return next(new AppError('You must buy this tour to review it', 401));
      next();
    });