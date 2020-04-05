from decimal import Decimal

from django import forms
from django.test import RequestFactory, TestCase

from braintree import ErrorCodes, ErrorResult

from .. import constants
from ..forms import (MinimumCurrencyAmountMixin, BraintreeCardPaymentForm)
from ..views import CardPaymentView


class MinimumCurrencyTestForm(MinimumCurrencyAmountMixin, forms.Form):
    amount = forms.DecimalField()
    currency = forms.ChoiceField(choices=constants.CURRENCY_CHOICES)


class MinimumCurrencyAmountMixinTestCase(TestCase):

    def test_init_sets_min_attr_if_currency_supplied(self):
        form = MinimumCurrencyTestForm(currency='usd')
        self.assertEqual(form.fields['amount'].widget.attrs['min'], 2)

    def test_clean_validates_minimum_amount(self):
        form = MinimumCurrencyTestForm({'amount': 1, 'currency': 'usd'})
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {'amount': ['Donations must be $2 or more']})


class CardPaymentViewTestCase(TestCase):

    def setUp(self):
        self.form_data = {
            'first_name': 'Alice',
            'last_name': 'Bob',
            'email': 'alice@example.com',
            'address_line_1': '1 Oak Tree Hill',
            'city': 'New York',
            'post_code': '10022',
            'country': 'US',
            'amount': Decimal(50),
            'braintree_nonce': 'hello-braintree',
            'landing_url': 'http://localhost',
            'project': 'mozillafoundation',
            'campaign_id': 'pi_day',
            'device_data': '{"some": "data"}'
        }

        self.request = RequestFactory().get('/')
        self.request.session = self.client.session
        self.request.LANGUAGE_CODE = 'en-US'
        self.view = CardPaymentView()
        self.view.payment_frequency = 'single'
        self.view.currency = 'usd'
        self.view.request = self.request

        self.fake_error_result = ErrorResult("gateway", {
            'message': 'Some error',
            'errors': {
                'credit_card': {
                    'errors': [
                        {
                            'code': ErrorCodes.CreditCard.CreditCardTypeIsNotAccepted,
                            'message': 'Type not accepted',
                        },
                        {
                            'code': ErrorCodes.CreditCard.CustomerIdIsInvalid,
                            'message': 'Invalid Customer ID',
                        }
                    ]
                }
            }
        })

    def test_valid_us_post_code(self):
        form = BraintreeCardPaymentForm(self.form_data)
        self.assertTrue(form.is_valid())

    def test_invalid_us_post_code(self):
        invalid_data = self.form_data
        invalid_data['post_code'] = 'M1C3A8'
        form = BraintreeCardPaymentForm(invalid_data)
        self.assertFalse(form.is_valid())

    def test_valid_canada_post_code(self):
        valid_data = self.form_data
        valid_data['country'] = 'CA'
        valid_data['post_code'] = 'M1C3A8'
        form = BraintreeCardPaymentForm(valid_data)
        self.assertTrue(form.is_valid())

    def test_invalid_canada_post_code(self):
        invalid_data = self.form_data
        invalid_data['country'] = 'CA'
        invalid_data['post_code'] = '1MC3A8'
        form = BraintreeCardPaymentForm(invalid_data)
        self.assertFalse(form.is_valid())
