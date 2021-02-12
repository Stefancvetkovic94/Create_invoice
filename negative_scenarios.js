/// <reference types="cypress" />

Cypress.Commands.add('SaveInvoice', (empty) => {
  
    cy.get('[data-original-button-text="Save"]')
   .scrollIntoView().click()
    cy.get('ul > li:nth-child(1) > button').click().wait(4000)

     })

Cypress.Commands.add('CheckAlert', (alert) => {
 
    cy.get('#alerts').should('contain', alert)


     })

     //nakon svakog dodatog invoice moram da ga obrisem zbog max limita na sajtu
Cypress.Commands.add('DeleteInvoice', (empty) => {
 
     cy.get('a').contains('Actions').click()
     cy.get('.i_delete').click(0, 0, { force: true })
     cy.get('.save_button').click()
       
   })



describe('Create invoice test', () => 
{
   beforeEach('Login',() => {

       const email = 'tvitermejl61@gmail.com'
       const password = 'plazmeni'
      
       cy.visit('https://invoicely.com/login')
       cy.get('#email').type(email)
       cy.get('#password').type(password)
       cy.get('form').submit().wait(3000)      
       cy.get('.css-sa76sr').click()
       cy.get('a').contains('Add New').click()
       cy.get('.i_new_invoice').click()
       cy.get('input[placeholder="Enter Client Name"]').click()
       cy.get('[data-index="0"]').should('be.visible').click()

     })

     it('Invoice No field - empty mandatory field',()=>
     {
       cy.get('[name="statement[number]"]').clear()
     
       cy.SaveInvoice()
       
       cy.CheckAlert('An error occurred. Please try again or contact support. (Error Reference: missing_statement_id)')
       
     })

     
     it('Invoice No field - input spaces',()=>
     {
       cy.get('[name="statement[number]"]').clear().type('   ')
       .should('have.value', '   ')
     
       cy.SaveInvoice()
       cy.CheckAlert('Invoice added.')
       cy.DeleteInvoice()

     })   

     it('Purchase order number - negative number',()=>
     {
       
       cy.get('[name="statement_po_number"]')
       .type('-4')
       .should('have.value','-4')

       cy.SaveInvoice()
       cy.CheckAlert('Invoice added.')
       cy.DeleteInvoice()
     })

     it('Purchase order number - tekst',()=>
     {
       
       cy.get('[name="statement_po_number"]')
       .type('test')
       .should('have.value','test')

       cy.SaveInvoice()
       cy.CheckAlert('Invoice added.')
       cy.DeleteInvoice()
     })

     it('Purchase order number - input spaces',()=>
     {
       
       cy.get('[name="statement_po_number"]')
       .type('   ')
       .should('have.value','   ')

       cy.SaveInvoice()
       cy.CheckAlert('Invoice added.')
       cy.DeleteInvoice()

     })

     it('Adding new client - empty spaces' ,()=>
        {
          cy.get('.close_icon').click(0, 0, { force: true })
          cy.get('.address_to > .form_heading > .right')
          .click()
     
  
          cy.get('.individual > .first')
          .type('        ')
          .should('have.value','        ')
  
          cy.get('[form="create_edit_connection_popup"]').click()
        
          cy.CheckAlert('Client added.')
          
        })

       
          
        it('Quantity - requared field is empty',()=>
        {
          cy.get('.quantity_input > input').clear()
          .should('be.empty')
    
          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice()

        })

        it('Quantity - input text',()=>
        {
          cy.get('.quantity_input > input')
          .should('have.attr','data-input-restriction','number')
          
          cy.get('.quantity_input > input')
          .type('test')
          .should('have.value','test')
          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice()
        
        })

        it('Quantity - input negative number',()=>
        {
          cy.get('.quantity_input > input')
          .should('have.attr','data-input-restriction','number')
          
          cy.get('.quantity_input > input')
          .type('-1')
          .should('have.value','-1')
          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice()
        
        })

        


     it('Rate field - input text',()=>
    {
      cy.get('[name="statement[item_rate]"]')
      .should('have.attr','data-input-restriction','number')
    
      cy.get('[name="statement[item_rate]"]').clear()
      .type('test')
      .should('have.value','test')
    
      cy.SaveInvoice()
      cy.CheckAlert('An error occurred. Please try again or contact support. (Error Reference: invalid_line_item_unit_price)')
    
    })

    it('Add link - empty tekst and url',()=>
    {
      cy.get('.left > :nth-child(4) > .attach_button').click()
    
      cy.get('.link_ttd').clear()
      cy.get('.link_url').clear()
      cy.get('.dropdown-menu > :nth-child(2) > .form_row > .save_button').click()
    
      cy.get('.link_ttd').should('have.class','link_ttd error')
      cy.get('.link_url').should('have.class','link_url error')
    
    })

        it('Rate field - input negative number',()=>
    {
      cy.get('[name="statement[item_rate]"]')
      .should('have.attr','data-input-restriction','number')
    
      cy.get('[name="statement[item_rate]"]').clear()
      .type('-10')
      .should('have.value','-10')
    
      cy.SaveInvoice()
      cy.CheckAlert('Invoice added.')
      cy.DeleteInvoice()

    })

    it('Total Tax button - Rate field -input negative number',()=>
        {
          cy.get('.button_row > .right > :nth-child(2) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get(' :nth-child(1) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('tax1')
          
          cy.get('#tax_rate_2').should('have.attr','data-input-restriction','percentage')

          cy.get('#tax_rate_2').clear().type('-4').should('not.have.value', '-4')

        })

        it('Total Tax button - Rate field-  input text',()=>
        {
          cy.get('.button_row > .right > :nth-child(2) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get(' :nth-child(1) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('tax1')
          
          cy.get('#tax_rate_2').should('have.attr','data-input-restriction','percentage')

          cy.get('#tax_rate_2').clear().type('abc!').should('not.have.value', 'abc!')

         
        })


        it('Total Discount button - input negative number',()=>
        {
          cy.get('.button_row > .right > :nth-child(3) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get('.inner > .right > :nth-child(2) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('tax1')
          
          cy.get('#discount_rate_2').should('have.attr','data-input-restriction','percentage')

          cy.get('#discount_rate_2').type('-4').should('not.have.value', '-4')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();
   
        })

        it('Total Discount button - input text',()=>
        {
          cy.get('.button_row > .right > :nth-child(3) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get('.inner > .right > :nth-child(2) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('tax1')
          
          cy.get('#discount_rate_2').should('have.attr','data-input-restriction','percentage')

          cy.get('#discount_rate_2').type('abc!').should('not.have.value', 'abc!')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();
   
        })

        it('Total Shipping button - input negative number',()=>
        {
          cy.get('.right > :nth-child(4) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get('.inner > .right > :nth-child(3) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('shipping')
          
          cy.get('#shipping_rate_2').should('have.attr','data-input-restriction','number')

          cy.get('#shipping_rate_2').type('-4').should('have.value', '-4')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();

        })

        it('Enter Client Name - empty mandatory field' ,()=>
        {
        
          cy.get('.close_icon').click(0, 0, { force: true })
          cy.get('input[placeholder="Enter Client Name"]').clear()
          .should('to.be.empty')
    
          cy.SaveInvoice()
          cy.CheckAlert('Please specify a client/vendor.')
    
        }) 

        it('Currency field - null  ',()=>
        {
    
          cy.get('[name="statement[currency]"]').select('----------------')
          .should('have.value','null')
    
         
          cy.SaveInvoice()
         
          cy.CheckAlert('An error occurred. Please try again or contact support. (Error Reference: invalid_statement_currency)')
       
        }) 

        it('Total Shipping button - input tekst',()=>
        {
          cy.get('.right > :nth-child(4) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get('.inner > .right > :nth-child(3) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('shipping')
          
          cy.get('#shipping_rate_2').should('have.attr','data-input-restriction','number')

          cy.get('#shipping_rate_2').type('abc!').should('have.value', 'abc!')

          cy.SaveInvoice()
          cy.CheckAlert('An error occurred. Please try again or contact support. (Error Reference: invalid_pricing_item_amount)')

        })

        it('Item Tax button - Rate field - input tekst',()=>
        {
          cy.get(':nth-child(1) > .attach_button').click()
          cy.get('.right > :nth-child(1) > .dropdown-menu')
          .should('be.visible')
          
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_item').click()
        
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input').type('tax1')
          
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','percentage')

          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .type('test').should('not.have.value', 'test')
        })

        it('Item Tax button - Rate field - input negative number',()=>
        {
          cy.get(':nth-child(1) > .attach_button').click()
          cy.get('.right > :nth-child(1) > .dropdown-menu')
          .should('be.visible')
          
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_item').click()
        
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input').type('tax1')
          
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','percentage')

          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .type('-4').should('not.have.value', '-4')
          
        })

        it('Item Discount button - input tekst',()=>
        {
          cy.get('.inner > .right > :nth-child(2) > .attach_button').click()
          cy.get(':nth-child(2) > .dropdown-menu')
          .should('be.visible')
          
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_item').click()
        
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input').type('discount')
          
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','percentage')

          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .type('tekst').should('not.have.value', 'tekst')

          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button')
          .click()

          

        })

        it('Item Discount button - input negative number',()=>
        {
          cy.get('.inner > .right > :nth-child(2) > .attach_button').click()
          cy.get(':nth-child(2) > .dropdown-menu')
          .should('be.visible')
          
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_item').click()
        
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input').type('discount')
          
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','percentage')

          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .type('-4').should('not.have.value', '-4')

        })

        it('Item Shipping button - input negative number',()=>
        {
          cy.get('.inner > .right > :nth-child(3) > .attach_button').click()
          cy.get(':nth-child(3) > .dropdown-menu')
          .should('be.visible')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_item').click()

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input').type('shipping')
          
          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','number')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input').type('-4')
          .should('have.value', '-4')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button')
          .click()

          cy.get('#tag_item_shipping_1_2').should('be.visible').and('contain','shipping')

          cy.get('.right > :nth-child(4) > .attach_button')
          .should('not.be.visible')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();

        })

        it('Item Shipping button - input tekst',()=>
        {
          cy.get('.inner > .right > :nth-child(3) > .attach_button').click()
          cy.get(':nth-child(3) > .dropdown-menu')
          .should('be.visible')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_item').click()

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input')
          .type('shipping')
          
          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','number')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .type('test').should('have.value', 'test')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button').click()

          cy.get('#tag_item_shipping_1_2').should('be.visible').and('contain','shipping')

          cy.get('.right > :nth-child(4) > .attach_button')
          .should('not.be.visible')

          cy.SaveInvoice()
          cy.CheckAlert('An error occurred. Please try again or contact support. (Error Reference: invalid_pricing_item_amount)')


        })

        it('Save item - new item form - empty fields',()=>
        {
          
          cy.get('.relative > .button').click()
          cy.get('.inner > :nth-child(1) > .relative > .dropdown-menu > :nth-child(2) > a').click() 
          cy.get('.page > :nth-child(2) > .form_row > input').clear()
          cy.get('.x_textarea_container > textarea').clear()
          cy.get(':nth-child(4) > .form_row > input').clear()
          cy.get(':nth-child(6) > .form_row > .save_button').click()

          cy.get('.message').should('contain', 'There were errors. Please try again.')

        })

        it('Save item - new item form - Unit price input text',()=>
        {
          
          cy.get('.relative > .button').click()
          cy.get('.inner > :nth-child(1) > .relative > .dropdown-menu > :nth-child(2) > a').click() 
          cy.get('.page > :nth-child(2) > .form_row > input').type('test')
          cy.get(':nth-child(4) > .form_row > input').clear().type('test').should('have.value','test')
          cy.get(':nth-child(6) > .form_row > .save_button').click()

          cy.get('.message').should('contain', 'An error occurred. Please try again or contact support. (Error Reference: invalid_price)')

        })

        it('Save item - new item form - Unit price input negative number',()=>
        {
          
          cy.get('.relative > .button').click()
          cy.get('.inner > :nth-child(1) > .relative > .dropdown-menu > :nth-child(2) > a').click() 
          cy.get('.page > :nth-child(2) > .form_row > input').type('test')
          cy.get(':nth-child(4) > .form_row > input').clear().type('-1').should('have.value','-1')
          cy.get(':nth-child(6) > .form_row > .save_button').click()

          cy.CheckAlert('Item added.')

        })

        it('Adding mileage -new trip form - rate empty field',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(3) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('mileage')
          
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Trip')
          cy.get('.page > :nth-child(3) > .form_row > input').clear()
          cy.get(':nth-child(4) > .form_row > .save_button').click()

          cy.get('.message').should('contain', 'There were errors. Please try again.')

        })

        it('Adding mileage -new trip form - rate negative number',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(3) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('mileage')
          
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Trip')
          cy.get('.page > :nth-child(3) > .form_row > input').clear().type('-10').should('have.value', '-10')
          cy.get(':nth-child(4) > .form_row > .save_button').click()

          cy.CheckAlert('Trip added.')

        })

        it('Adding mileage -new trip form - rate field input text',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(3) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('mileage')
          
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Trip')
          cy.get('.page > :nth-child(3) > .form_row > input').clear().type('test').should('have.value', 'test')
          cy.get(':nth-child(4) > .form_row > .save_button').click()

          cy.get('.message').should('contain', 'An error occurred. Please try again or contact support. (Error Reference: invalid_rate)')
        })

        it('Adding task - new task form - hourly rate field input tekst',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(4) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('task')
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Task')
          cy.get('.page > :nth-child(3) > .form_row > input').clear().type('test').should('have.value','test')


          cy.get(':nth-child(4) > .form_row > .save_button').click()

          cy.get('.message').should('contain', 'An error occurred. Please try again or contact support. (Error Reference: invalid_rate)')

        })

        it('Adding task - new task form - hourly rate field input negative number',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(4) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('task')
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Task')
          cy.get('.page > :nth-child(3) > .form_row > input').clear().type('-1').should('have.value','-1')


          cy.get(':nth-child(4) > .form_row > .save_button').click()

          cy.CheckAlert('Task added.')

        })

        it('Adding task - new task form - hourly rate field - empty field input',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(4) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('task')
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Task')
          cy.get('.page > :nth-child(3) > .form_row > input').clear().should('be.empty')


          cy.get(':nth-child(4) > .form_row > .save_button').click()

          cy.get('.message').should('contain', 'There were errors. Please try again.')

        })

        it('Adding New Tag - empty name',()=>
    {
      cy.get(':nth-child(5) > .attach_button').click()
    
      cy.get(':nth-child(5) > .dropdown-menu > .gray > .new_item').click()
    
      cy.get(':nth-child(5) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button')
      .click()  
    
      cy.get('#new_tag_1')
      .should('have.attr','class','new_tag_item_input error')


  })

        it('Task - quantity field- input negative time value',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(4) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('[data-id="2"] > .item_row > .quantity > .inner > .quantity_input > input')
          .should('have.attr','data-input-restriction','time')

          cy.get('[data-id="2"] > .item_row > .quantity > .inner > .quantity_input > input').clear().type('-10')
          cy.get('[data-id="1"] > .item_row > .quantity > .inner > .quantity_input > input').click()
          cy.get('[data-id="2"] > .item_row > .quantity > .inner > .quantity_input > input')
          .should('have.attr','data-total-minutes','-600')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();


        })

        it('"Invoice Settings, Payment & Delivery" button - client must me selected',()=>
        {
          cy.get('.close_icon').click(0, 0, { force: true })
          cy.get('footer > .button').click()
          
          cy.CheckAlert('Please specify a client/vendor first.')

      
            })   


    




    })